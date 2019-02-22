import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cellar',
  templateUrl: './cellar.component.html',
  styleUrls: ['./cellar.component.css','../../../flags.css','../../../flags.min.css']
})
export class CellarComponent implements OnInit {
  isAuth:boolean=false;
  uid:any=null;
  //suggestion
  suggestionList:any;
  //cellar
  listCellarSelect:any=[];
  allCellar:any=[];
  cellarWind:any=[];
  cellarLiquors:any=[];
  //shipping
  shippingSelect:any=null;
  address:any=null;
  addressShipping:any=null;
  allAddressShipping:any=[];
  shippingList:any=[
    {
      id:1,
      name:'Enviar a la dirección guardada',
    },
    {
      id:2,
      name:'Enviar a un amigo',
    },
  ];
  
  constructor(public fireSrv:FirebaseService,private cookieService: CookieService) { }

  ngOnInit() {
    this.getSuggestion();
    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
      this.uid=this.cookieService.get('userLogged');
      this.fireSrv.getAddressUser(this.uid).subscribe(addressData=>{
        if(addressData!=null){
          this.addressShipping=addressData
        }
      });
    }else{
      this.isAuth=false;
    }
    this.getCellar();
  }

  goToShip(){
    if(this.isAuth){
      if(this.listCellarSelect.length>0){
        if(this.shippingSelect!=undefined){
          console.log('autenticado', this.shippingSelect, this.addressShipping);
          if(this.shippingSelect==1){
            if(this.address!=null){
              console.log('autenticado', this.shippingSelect, this.addressShipping);
              if(this.addressShipping==null){
                this.fireSrv.setUserAddress(this.uid,this.address);
              }
            }else{
              alert('No ha ingresado una dirección de envio.')  
            }
          }else if(this.shippingSelect==2){
            if(this.address!=null){
              console.log('autenticado', this.shippingSelect, this.addressShipping);
              if(this.addressShipping==null){
                this.fireSrv.setUserFriendsAddress(this.uid,this.address);
              }
            }else{
              alert('No ha ingresado una dirección de envio.')  
            }
          }
        }else{
          alert('Debe indicar a donde enviaremos los productos.')
        }
      }else{
        alert('No hay productos para enviar.')
      }
    }
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
    //this.showInfoCart=false;
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

  getCellar(){
    this.fireSrv.getCellarByUserId(this.uid).subscribe(cellarData=>{
      this.cellarLiquors=[];
      this.cellarWind=[];
      this.allCellar=[];
      //Search item by item to get data
      for(let i = 0; i < Object.keys(cellarData).length; i++){
        this.fireSrv.getProducById(Object.values(cellarData)[i].id).subscribe(productData=>{//Get product data
          if(productData['productTypeId']==1){//Winds on cellar 
            this.cellarWind.push({id:Object.values(cellarData)[i].id,data:productData,quantity:Object.values(cellarData)[i].quantity});//Add on array winds
          }else if(productData['productTypeId']==2){//Liquors on cellar 
            this.cellarLiquors.push({id:Object.values(cellarData)[i].id,data:productData,quantity:Object.values(cellarData)[i].quantity});//Add on array liquors
          }
          this.allCellar.push({id:Object.values(cellarData)[i].id,data:productData,quantity:Object.values(cellarData)[i].quantity});//Add on array liquors
        });
      }
    });
  }

  selectProduct(events){
    if(events.target.checked){
      for(let i = 0; i < this.allCellar.length; i++){
        if(this.allCellar[i].id==events.target.defaultValue){
          this.allCellar[i].quantity=1
          this.listCellarSelect.push(this.allCellar[i]);
        }
      }
    }else{
      if(this.listCellarSelect.length>0){
        for(let i = 0; i < this.listCellarSelect.length; i++){
          if(this.listCellarSelect[i].id==events.target.defaultValue){
            this.listCellarSelect.splice(this.listCellarSelect.findIndex(data=>data.id==events.target.defaultValue),1);
          }
        }
      }
    }
  }

  remove(id){
    //Compare min quantity 
    if(this.listCellarSelect[this.listCellarSelect.findIndex(data=>data.id==id)].quantity==1){
      this.listCellarSelect[this.listCellarSelect.findIndex(data=>data.id==id)].quantity=1;//Min quantity
    }else{
      this.listCellarSelect[this.listCellarSelect.findIndex(data=>data.id==id)].quantity-=1;//dismiss 1 on quantity
    }
  }

  add(id){
    let _quantity;//temporal variable
    if(this.cellarLiquors.findIndex(data => data.id==id)!=-1){//search element on array liquors
      _quantity=this.cellarLiquors[this.cellarLiquors.findIndex(data => data.id==id)].quantity;//Get maximiun quantity
    }else if(this.cellarWind.findIndex(data => data.id==id)!=-1){//search element on array winds
      _quantity=this.cellarWind[this.cellarWind.findIndex(data => data.id==id)].quantity//Get maximiun quantity
    }
    //Compare max quantity 
    if(this.listCellarSelect[this.listCellarSelect.findIndex(data=>data.id==id)].quantity==_quantity){
      this.listCellarSelect[this.listCellarSelect.findIndex(data=>data.id==id)].quantity=_quantity;//max quantity
    }else{
      this.listCellarSelect[this.listCellarSelect.findIndex(data=>data.id==id)].quantity+=1;//add 1 on quantity
    }
  }
}
