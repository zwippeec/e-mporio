import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productsData:any;
  isUserAuth:boolean=false;
  nameList:any=null;
  wishesList:any=[];
  wishesListSelect:any=null;
  productId:any;
  saveOnWishesList:boolean=false;
  errorAuth:boolean=false;

  constructor(public fireSrv: FirebaseService,private cookieService: CookieService,private modalService: NgbModal ) { 
    this.allProducts();
    
  }

  ngOnInit() {
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
      this.getWishesList();
    }else{
      this.isUserAuth = false;
    }
  }

  getWishesList(){
    this.fireSrv.getWishesList(this.cookieService.get('userLogged')).subscribe(wishes=>{
      this.wishesList=[];
      for(let i = 0; i < Object.keys(wishes).length; i++){
        this.wishesList.push(Object.keys(wishes)[i]);
      }
    });
  }

  allProducts(){
    this.fireSrv.getAllProducts().subscribe(productsData=>{
      this.productsData=productsData;
    });
  }

  addWishesList(){
    if(this.isUserAuth){
      if(this.wishesListSelect!=null){
        this.nameList=this.wishesListSelect;
      }
      this.fireSrv.addItemWishesList(this.cookieService.get('userLogged'),this.productId,this.nameList).then(resOk=>{
        this.nameList=null;
        this.productId=null;
        this.saveOnWishesList=true;
        this.wishesListSelect=null;
        this.closeModal();
      });
    }else{
      this.errorAuth=true;
      this.closeModal();
    }
  }

  removeWishesList(codeId){
    this.fireSrv.removeItemWishesList(this.cookieService.get('userLogged'),codeId,this.nameList);
  }
  
  openModal(content, idP) {
    this.errorAuth=false;
    this.saveOnWishesList=false;
    this.productId=idP;
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  closeModal(){
    this.modalService.dismissAll();
    this.getWishesList();
  }
}
