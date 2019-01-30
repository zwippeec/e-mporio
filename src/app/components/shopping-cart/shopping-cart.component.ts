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

}
