import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-wishes-list',
  templateUrl: './wishes-list.component.html',
  styleUrls: ['./wishes-list.component.css']
})
export class WishesListComponent implements OnInit {
  isUserAuth:boolean=false;
  wishesList=[];

  constructor(public fireSrv: FirebaseService,private cookieService: CookieService) {
    
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
    this.fireSrv.getWishesList(this.cookieService.get('userLogged')).subscribe(wishesListData=>{
      console.log(wishesListData)
      if(wishesListData!=null){
        this.wishesList=[];
        for(let i = 0; i < Object.keys(wishesListData).length; i++){
          let nameList=Object.keys(wishesListData)[i];
          let itemsList = wishesListData[nameList];
          let productsData=[]
          for(let j = 0; j < itemsList.length-1; j++){
            this.fireSrv.getProducById(Object.keys(itemsList)[j]).subscribe(prod=>{
              //console.log(nameList,prod);
              productsData.push(prod)
            });
          }
          this.wishesList.push({name:nameList,items:productsData}); 
        }
      }
    });
  }

}
