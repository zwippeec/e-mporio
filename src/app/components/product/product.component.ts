import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productsData:any;
  isUserAuth:boolean=false;
  
  constructor(public fireSrv: FirebaseService,private cookieService: CookieService) { 
    this.allProducts();
  }

  ngOnInit() {
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
    }else{
      this.isUserAuth = false;
    }
  }

  allProducts(){
    this.fireSrv.getAllProducts().subscribe(productsData=>{
      this.productsData=productsData;
    });
  }

}
