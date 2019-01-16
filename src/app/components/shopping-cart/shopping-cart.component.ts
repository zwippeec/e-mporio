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
  totalPay:any=0.00;
  constructor( public fireSrv:FirebaseService,private cookieService:CookieService) { 
    
  }

  ngOnInit() {
    this.listCart=[];
    this.itemsCart=[];
    if(localStorage.getItem('listCart')){
      this.itemsCart=JSON.parse(localStorage.getItem('listCart'));
      for(let i = 0; i < JSON.parse(localStorage.getItem('listCart')).length ;i++){
        this.fireSrv.getProducById(this.itemsCart[i].id).subscribe(itemData=>{
          let _totalUni=this.itemsCart[i].quantity*itemData['cost'];
          this.totalPay+=_totalUni;
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
    this.totalPay=0;
  }

  goToPay(){
    let _uid=this.cookieService.get('userLogged');
    let _data={};
    _data={
      date:database.ServerValue.TIMESTAMP,
      itemsData:this.itemsCart,
      //itemsProd:this.listCart,
      total:this.totalPay,
      payment:null,
      statusPayment:'pending'
    }
    console.log(_data)
    this.fireSrv.payOrder(_uid,_data);
    this.clearData();
  }

}
