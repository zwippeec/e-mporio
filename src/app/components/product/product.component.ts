import { Component, OnInit,Pipe, PipeTransform } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
@Pipe({name: 'windFilter'})
export class ProductComponent implements OnInit {

  productsData:any;
  isUserAuth:boolean=false;
  nameList:any=null;
  wishesDataList:any=[];
  wishesList:any=[];
  wishesListSelect:any=null;
  productId:any;
  saveOnWishesList:boolean=false;
  errorAuth:boolean=false;

  //filters
  priceFilter:any=null;
  foodFilter:any=null;
  moodFilter:any=null;
  styleFilter:any=null;
  cellerFilter:any=null;
  grapeFilter:any=null;
  regionFilter:any=null;
  countryFilter:any=null;
  windFilter:any;

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
      this.wishesDataList=[];
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

  addCart(Pid,typeData){
    let items:any=[];//array to first object
    let _tmpList:any=[];//temporal array to list cart
    //Condition if exits listCart or create new list
    if(localStorage.getItem('listCart')!=null){
      _tmpList=JSON.parse(localStorage.getItem('listCart'));//get list cart
      //Condition to add item or increase quantity on item
      if(_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)!=-1){
        _tmpList[_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)].quantity+=1;//increase quantity on item 
      }else{
        _tmpList.push({id:Pid,quantity:1,type:typeData})//add item on list if no exist
      } 
      localStorage.removeItem('listCart');//remove old list
      localStorage.setItem('listCart',JSON.stringify(_tmpList))//create new list
    }else{
      items.push({id:Pid,quantity:1,type:typeData});//first item on list
      localStorage.setItem('listCart',JSON.stringify(items))//create list
    }
  }

  filter(){
    console.log(this.priceFilter,this.foodFilter,this.moodFilter,this.styleFilter,this.cellerFilter,this.grapeFilter,
      this.regionFilter,this.countryFilter,this.windFilter)
  }
}
