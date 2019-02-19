import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-wishes-list',
  templateUrl: './wishes-list.component.html',
  styleUrls: ['./wishes-list.component.css']
})
export class WishesListComponent implements OnInit {
  isUserAuth:boolean=false;//is logged
  uid:any;//user id
  wishesList=[];//name wishes list
  wishesDataList=[];//all item wishes list
  productsList=[];//specific wishes list
  idListSelect:any=0;//show data on array
  packList:any;//list pack
  suggestionList:any;
  //Info cart
  listCart:any=[];
  itemsCart:any=[];
  subtotalPay:any=0.00;
  showInfoCart:boolean=true;//show or hide info

  constructor(public fireSrv: FirebaseService,private cookieService: CookieService) {}

  ngOnInit() {
    this.listCart=[];
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
      this.uid=this.cookieService.get('userLogged');
      this.getWishesList();
    }else{
      this.isUserAuth = false;
    }
    this.getPacks();
    this.getSuggestion();
    
    if(localStorage.getItem('listCart')){
      this.itemsCart=JSON.parse(localStorage.getItem('listCart'));
      this.subtotalPay=0;
      for(let i = 0; i < JSON.parse(localStorage.getItem('listCart')).length ;i++){
        this.fireSrv.getProducByIdPay(this.itemsCart[i].type,this.itemsCart[i].id).subscribe(itemData=>{
          let _totalUni=this.itemsCart[i].quantity*itemData['cost'];
          this.subtotalPay+=_totalUni;
          this.listCart.push({id:this.itemsCart[i].id,data:itemData,quantity:this.itemsCart[i].quantity,totalUni:_totalUni})
        });
      }
    }
  }

  getWishesList(){
    this.fireSrv.getWishesList(this.cookieService.get('userLogged')).subscribe(wishesListData=>{
      if(wishesListData!=null){
        this.wishesList=[];
        this.wishesDataList=[];
        for(let i = 0; i < Object.keys(wishesListData).length; i++){
          let nameList=Object.keys(wishesListData)[i];
          let itemsList = Object(wishesListData[nameList]);
          let productsData=[];
          for(let j = 0; j < Object.keys(itemsList).length; j++){
            if(Object.keys(itemsList)[j]!=null || Object.keys(itemsList)[j]!=undefined){
              this.fireSrv.getProducById(Object.keys(itemsList)[j]).subscribe(prod=>{
                productsData.push(prod)
              });
            }
          }
          this.wishesList.push({name:nameList}); 
          this.wishesDataList.push({productsData}); 
        }
        this.productsList=this.wishesDataList[this.idListSelect];
      }
    }); 
  }

  selectList(idList){
    this.productsList=[];
    this.idListSelect=idList;
    this.productsList=this.wishesDataList[idList];
  }

  removeItem(idListSelect,indexProd){
    let _nameList=this.wishesList[idListSelect].name;
    let _itemList=this.wishesDataList[idListSelect].productsData[indexProd].idP;
    this.fireSrv.removeItemWishesList(this.uid,_itemList,_nameList);
  }

  getPacks(){
    this.fireSrv.getPacks().subscribe(packData=>{
      this.packList=packData;
    });
  }
  getSuggestion(){
    this.fireSrv.getSuggestion(4).subscribe(dataSuggestion=>{
      this.suggestionList=dataSuggestion;
      setTimeout(()=>{this.slidePromotion();},2000);
    })
  }
  slidePromotion(){
    var timer = 8000;//time to change items
    var i=0;
    var max = document.querySelectorAll('#promotion > li').length;//length list to show promotion
    var showNumItems=4;
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
  hideInfoCart(){
    this.showInfoCart=true;
  }
}