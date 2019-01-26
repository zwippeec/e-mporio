import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../service/firebase.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {

  product:any=null;
  packList:any=null;
  
  promotionList:any;
  timerPromotion:any=[];
  horas;
  minuto;
  segundos; 
  intervalo;

  constructor(private _router: Router, private _activeRouter: ActivatedRoute, public fireSrv:FirebaseService,private modalService: NgbModal) {
  }

  ngOnInit() {
    this.fireSrv.getProducByCode(this._activeRouter.snapshot.paramMap.get('id')).subscribe(product=>{
      this.product=product[0];
    });
    this.getPacks();
  }

  openModal(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  closeModal(){
    this.modalService.dismissAll();
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

  getPacks(){
    this.fireSrv.getPacks().subscribe(packData=>{
      console.log('pack',packData)
      this.packList=packData;
      
    });
  }
}
