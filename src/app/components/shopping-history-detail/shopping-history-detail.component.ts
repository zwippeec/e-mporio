import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-shopping-history-detail',
  templateUrl: './shopping-history-detail.component.html',
  styleUrls: ['./shopping-history-detail.component.css']
})
export class ShoppingHistoryDetailComponent implements OnInit {
  orderId:any=null;
  uid:any=null;
  isAuth:boolean=false;
  order:any;
  messageAuth:any=null;
  messageElements:any=null;
  constructor(public fireSrv:FirebaseService,private _router: ActivatedRoute,private cookieService:CookieService) { }

  ngOnInit() {
    let _orderId=this._router
    .queryParamMap
    .pipe(map(params=>params.get('orderId') || null));
    this.orderId=_orderId['destination']['source']['_value'].orderId;
    
    if(this.orderId==null){
      this.messageElements='Oops. Parece que algo anda mal. No hemos podido encontrar la información.';
    }

    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
      this.uid=this.cookieService.get('userLogged');
      this.fireSrv.getHistorialByOrder(this.uid,this.orderId).subscribe(orderData=>{
        let _date= new Date(orderData['date']);
        this.order=orderData;
        this.order.date=_date.getDate()+"/"+(_date.getMonth()+1)+"/"+_date.getFullYear();
        console.log(this.order)
        
      })
    }else{
      this.isAuth=false;
      this.messageAuth='Debes tener cuenta e iniciar sesión para ver tu historial de compra.'
    }

  }

}
