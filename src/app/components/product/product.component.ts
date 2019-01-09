import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productsData:any;
  constructor(public fireSrv: FirebaseService) { 
    this.allProducts();
  }

  ngOnInit() {
  }

  allProducts(){
    this.fireSrv.getAllProducts().subscribe(productsData=>{
      this.productsData=productsData;
    });
  }

}
