import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { database } from "firebase";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  listCart:any=[];
  itemsCart:any=[];
  subtotalPay:any=0.00;
  totalPay:any=0.00;
  coupon:any=10.00;
  taxSend:any=5.00;

  saveCellar:boolean=false;
  isAuth:boolean=false;

  promotionList:any;
  timerPromotion:any=[];
  horas;
  minuto;
  segundos; 
  intervalo;

  paymentsType:any=[
    {
      id:1,
      name:'American Express',
      url:'../../assets/amex.png'
    },
    {
      id:2,
      name:'MasterCard',
      url:'../../assets/master.png'
    },
    {
      id:3,
      name:'Visa',
      url:'../../assets/visa.png'
    },
    {
      id:4,
      name:'Diners Club',
      url:'../../assets/diners.png'
    },
    {
      id:5,
      name:'PayPal',
      url:'../../assets/paypal.png'
    },
    {
      id:6,
      name:'Efectivo',
      url:'../../assets/money.png'
    },
    {
      id:7,
      name:'Transferencia',
      url:'../../assets/transfer.png'
    }
  ];

  constructor( public fireSrv:FirebaseService,private cookieService:CookieService) {  }

  ngOnInit() {
    this.getPromotion();
    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
    }else{
      this.isAuth=false;
    }

    this.listCart=[];
    this.itemsCart=[];
    if(localStorage.getItem('listCart')){
      this.itemsCart=JSON.parse(localStorage.getItem('listCart'));
      for(let i = 0; i < JSON.parse(localStorage.getItem('listCart')).length ;i++){
        this.fireSrv.getProducById(this.itemsCart[i].id).subscribe(itemData=>{
          let _totalUni=this.itemsCart[i].quantity*itemData['cost'];
          this.subtotalPay+=_totalUni;
          this.totalPay=this.subtotalPay+this.taxSend-this.coupon;
          this.listCart.push({id:this.itemsCart[i].id,data:itemData,quantity:this.itemsCart[i].quantity,totalUni:_totalUni})
        });
      }
    }
  }

  clearData(){
    localStorage.removeItem('listCart');
    this.ngOnInit();
    this.listCart=[];
    this.itemsCart=[];
    this.subtotalPay=0;
    this.totalPay=0;
    this.saveCellar=false;
  }

  goToPay(){
    if(this.isAuth){
      if(this.itemsCart.length>0){
        let _uid=this.cookieService.get('userLogged');
        let _data={};
        _data={
          date:database.ServerValue.TIMESTAMP,
          itemsData:this.itemsCart,
          //itemsProd:this.listCart,
          subtotal:this.subtotalPay,
          payment:null,
          statusPayment:'pending'
        }
        console.log(_data)
        this.fireSrv.payOrder(_uid,_data);
        if(this.saveCellar){
          this.fireSrv.saveOnMyCellar(_uid,this.itemsCart);
        }
        this.clearData();
      }else{
        alert('carrito vacio')
      }
    }else{
      alert('debes iniciar sesion')
    }
  }

  saveOnCellar(e){
    this.saveCellar=e.target.checked
  }

  slidePromotion(){
    var timer = 8000;//time to change items
    var i=0;
    var max = document.querySelectorAll('#promotion > li').length;//length list to show promotion
    var showNumItems=3;
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

  getPromotion(){
    this.fireSrv.getPromotion(3).subscribe(dataPromotion=>{
      this.promotionList=dataPromotion;
      for(let i = 0; i<dataPromotion.length;i++){
        this.timerPromotion.push({id:i, endDate:dataPromotion[i]['endDate']})
      }

      setTimeout(()=>{this.slidePromotion();},2000);
      //BeginTimer//Display timer
      this.intervalo=window.setInterval(()=>{
        for(let i = 0; i<this.timerPromotion.length; i++){
          let now = new Date();  //Get nowaday
          let clock = new Date(this.timerPromotion[i].endDate); // Obtener la fecha y almacenar en clock  
          let day=clock.getUTCDate()-now.getUTCDate();//Get day
          let cont=false;
          if(day>=0){
            this.horas=day*24;//cuando dia sea mayor a 0
            this.horas+=clock.getHours() - now.getHours();//Sum hours with days
            if(this.horas>=0){
              if(clock.getMinutes() >= now.getMinutes()){
                this.minuto = clock.getMinutes()-1 - now.getMinutes();//Get minutos
                if(clock.getSeconds() >= now.getSeconds()){
                  this.segundos = clock.getSeconds() - now.getSeconds();//Get seconds
                } else if(clock.getSeconds() < now.getSeconds()){ 
                  this.segundos = clock.getSeconds()+60 - now.getSeconds();//Get seconds
                }
              } else if(clock.getMinutes() < now.getMinutes()){
                this.minuto = clock.getMinutes()+60 - now.getMinutes();//Get minutos
                if(clock.getSeconds() >= now.getSeconds()){
                  this.segundos = clock.getSeconds() - now.getSeconds();//Get   seconds
                } else if(clock.getSeconds() < now.getSeconds()){ 
                  this.segundos = clock.getSeconds()+60 - now.getSeconds();//Get seconds
                }
              }
              if(this.horas==1){
                this.horas=0;
              }
              if(this.minuto<0){
                this.minuto="0"+0;
                cont=true;
              }
              if(this.horas == "0" && this.minuto <= "00" && cont){
                this.promotionList[i].time="00:00:00";
                cont=false
                this.timerPromotion.splice(i,1)
              }else{
                this.promotionList[i].time=this.horas+":"+this.minuto+":"+this.segundos;
              }
            }else{
              this.horas=0;
              this.minuto=0;
              this.segundos=0;
            }
          }else{
            clearTimeout(this.intervalo);
            this.timerPromotion.splice(i,1)
          }
        }
      }, 1000);// Frecuencia de actualización;
      //endTimer
    })
  }
}
