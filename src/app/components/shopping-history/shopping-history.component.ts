import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-shopping-history',
  templateUrl: './shopping-history.component.html',
  styleUrls: ['./shopping-history.component.css','../../../flags.css','../../../flags.min.css']
})
export class ShoppingHistoryComponent implements OnInit {

  isAuth:boolean=false;
  uid:any;
  historial:any=[];
  historialKeys:any=[];
  message:any=null;
  //suggestion
  suggestionList:any;
  //Info cart
  listCart:any=[];
  itemsCart:any=[];
  subtotalPay:any=0.00;
  showInfoCart:boolean=true;//show or hide info

  constructor(public fireSrv:FirebaseService,private cookieService:CookieService,private _router: Router) { 
    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
      this.uid=this.cookieService.get('userLogged');

      //get binnacle
      this.fireSrv.getHistorialByUserId(this.uid).subscribe(historialData=>{
        this.historial=historialData;
        //get Keys
        this.fireSrv.getHistorialByUserIdObjects(this.uid).subscribe(historialKeysData=>{
          for(let i=0; i<historialData.length; i++){
            let _date = new Date(historialData[i]['date'])
            //this.historial[i]['date']=_date.getDate()+"/"+(_date.getMonth()+1)+"/"+_date.getUTCFullYear()+" "+_date.getHours()+":"+_date.getMinutes()+":"+_date.getMilliseconds();
            this.historial[i]['date']=_date.getDate()+"/"+(_date.getMonth()+1)+"/"+_date.getUTCFullYear();//date
            this.historial[i]['key']=Object.keys(historialKeysData)[i];
          }
        })
      })
    }else{
      this.isAuth=false;
      this.message='Debes tener cuenta e iniciar sesión para ver tu historial de compra.'
    }
  }

  ngOnInit() {
    this.getSuggestion();

    this.listCart=[];
    this.itemsCart=[];
    this.subtotalPay=0;
    if(localStorage.getItem('listCart')){
      this.itemsCart=JSON.parse(localStorage.getItem('listCart'));
      for(let i = 0; i < JSON.parse(localStorage.getItem('listCart')).length ;i++){
        this.fireSrv.getProducByIdPay(this.itemsCart[i].type,this.itemsCart[i].id).subscribe(itemData=>{
          let _totalUni=this.itemsCart[i].quantity*itemData['cost'];
          this.subtotalPay+=_totalUni;
          this.listCart.push({id:this.itemsCart[i].id,data:itemData,quantity:this.itemsCart[i].quantity,totalUni:_totalUni})
        });
      }
    }
  }

  detailsByOrder(id){
    window.location.reload();
    let navigationExtras: NavigationExtras={
      queryParams:{'orderId':id}
    }
    this._router.navigate(['/orderDetail'],navigationExtras);
  }

  slidePromotion(){
    var timer = 8000;//time to change items
    var i=0;
    var max = document.querySelectorAll('#promotion > li').length;//length list to show promotion
    var showNumItems=3;//num item to show on promotion slide
    let _positionItem=0;
    let _transitionItem=0;

    for(let j = 0; j < showNumItems; j++){
      document.querySelectorAll('#promotion > li')[j].classList.add('active');//Add class active to item
      document.querySelectorAll('#promotion > li')[j].setAttribute("style","left:"+_positionItem+"%;")//Add 'position' style
      _positionItem+=(100/showNumItems);
    }
    //funtion to change item
    setInterval(function(){ 
      _positionItem=0;
      _transitionItem=0;
      //remove 'active' class on all items
      for(let i = 0; i<max ;i++){
        document.querySelectorAll('#promotion > li')[i].classList.remove('active');
      }
      //Transition
      for(let j = i; j < i+showNumItems; j++){
        _transitionItem+=(1/showNumItems);
        document.querySelectorAll('#promotion > li')[j].setAttribute('style','left:'+_positionItem+'%; transition-delay:'+_transitionItem+'s;');//Add 'transition' style
        _positionItem+=(100/showNumItems);
      }
      //Sum var 'i' to change items 
      if (i < max-showNumItems) {
        i = i+showNumItems; 
      }else { 
        i = 0; 
      }  
      //Add 'active' class//Add 'transition' style
      _positionItem=0;
      _transitionItem=1;
      for(let j = i; j < i+showNumItems; j++){
        _transitionItem+=(1/showNumItems);
        document.querySelectorAll('#promotion > li')[j].classList.add('active');//Add 'active' class
        document.querySelectorAll('#promotion > li')[j].setAttribute('style','left:'+_positionItem+'%;transition-delay:'+_transitionItem+'s;');//Add 'transition' style
        _positionItem+=(100/showNumItems);
      }    
    }, timer);
  }

  getSuggestion(){
    this.fireSrv.getSuggestion(3).subscribe(dataSuggestion=>{
      this.suggestionList=dataSuggestion;
      setTimeout(()=>{this.slidePromotion();},2000);
    })
  }

  addCart(Pid,typeData,quantity){
    this.showInfoCart=false;
    let items:any=[];//array to first object
    let _tmpList:any=[];//temporal array to list cart

    if(quantity==undefined){
      quantity=1;
    }

    //Condition if exits listCart or create new list
    if(localStorage.getItem('listCart')!=null){
      _tmpList=JSON.parse(localStorage.getItem('listCart'));//get list cart
      //Condition to add item or increase quantity on item
      if(_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)!=-1){
        _tmpList[_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)].quantity+=quantity;//increase quantity on item 
      }else{
        _tmpList.push({id:Pid,quantity:quantity,type:typeData})//add item on list if no exist
      } 
      localStorage.removeItem('listCart');//remove old list
      localStorage.setItem('listCart',JSON.stringify(_tmpList))//create new list
    }else{
      items.push({id:Pid,quantity:quantity,type:typeData});//first item on list
      localStorage.setItem('listCart',JSON.stringify(items))//create list
    }
    this.ngOnInit();
  }

  scroll(){
    document.querySelector('#cartSection').scrollIntoView();
  }
  hideInfoCart(){
    this.showInfoCart=true;
  }
}