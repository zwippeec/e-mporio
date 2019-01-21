import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product:any=null;
  
  constructor(private _router: Router, private _activeRouter: ActivatedRoute, public fireSrv:FirebaseService) {
  }

  ngOnInit() {
    this.fireSrv.getProducByCode(this._activeRouter.snapshot.paramMap.get('id')).subscribe(product=>{
      this.product=product[0];
    });
  }



}
