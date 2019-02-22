import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { database } from "firebase";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css','../../../flags.css','../../../flags.min.css']
})
export class ShoppingCartComponent implements OnInit {

  listCart:any=[];
  itemsCart:any=[];
  subtotalPay:any=0.00;
  totalPay:any=0.00;
  coupon:any=0.00;
  taxSend:any=5.00;
  paymentSelect:any=null;
  saveCellar:boolean=false;
  isAuth:boolean=false;
  //Cellar wind
  myCellarWinds:any=[];
  //suggestion
  suggestionList:any;
  //login 
  mail:any=null;
  password:any=null;
  message:any=null;

  paymentsType:any=[
    {
      id:1,
      name:'American Express',
      url:'../../assets/American Express.png'
    },
    {
      id:2,
      name:'MasterCard',
      url:'../../assets/MasterCard.png'
    },
    {
      id:3,
      name:'Visa',
      url:'../../assets/Visa.png'
    },
    {
      id:4,
      name:'Diners Club',
      url:'../../assets/Diners Club.png'
    },
    {
      id:5,
      name:'PayPal',
      url:'../../assets/PayPal.png'
    },
    {
      id:6,
      name:'Efectivo',
      url:'../../assets/Efectivo.png'
    },
    {
      id:7,
      name:'Transferencia',
      url:'../../assets/Transferencia.png'
    }
  ];

  constructor( public fireSrv:FirebaseService,private cookieService:CookieService) { }

  ngOnInit() {
    this.getSuggestion();
    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
    }else{
      this.isAuth=false;
    }

    this.listCart=[];
    this.itemsCart=[];
    this.subtotalPay=0;
    this.totalPay=0;
    if(localStorage.getItem('listCart')){
      this.itemsCart=JSON.parse(localStorage.getItem('listCart'));
      for(let i = 0; i < JSON.parse(localStorage.getItem('listCart')).length ;i++){
        this.fireSrv.getProducByIdPay(this.itemsCart[i].type,this.itemsCart[i].id).subscribe(itemData=>{
          let _totalUni=this.itemsCart[i].quantity*itemData['cost'];
          this.subtotalPay+=_totalUni;
          this.totalPay=this.subtotalPay+this.taxSend-this.coupon;
          this.listCart.push({id:this.itemsCart[i].id,data:itemData,quantity:this.itemsCart[i].quantity,totalUni:_totalUni,type:this.itemsCart[i].type})
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
    this.paymentSelect=null;
    window.location.reload();
  }

  goToPay(){
    if(this.itemsCart.length>0){
      if(this.paymentSelect!=null){
        let _uid=this.cookieService.get('userLogged');
        let _data={};
        _data={
          date:database.ServerValue.TIMESTAMP,
          itemsData:this.itemsCart,
          itemsProd:this.listCart,
          subtotal:this.subtotalPay,
          payment:this.paymentSelect,
          statusPayment:'pending'
        }
        this.fireSrv.payOrder(_uid,_data);
        if(this.saveCellar){
          this.cellar();
        }
      }else{
        alert('No se a seleccionado un método de pago.');
      }
    }else{
      alert('carrito vacio')
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

  getSuggestion(){
    this.fireSrv.getSuggestion(3).subscribe(dataSuggestion=>{
      this.suggestionList=dataSuggestion;
      setTimeout(()=>{this.slidePromotion();},2000);
    })
  }

  addCart(Pid,typeData,quantity){
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

  scroll(){
    document.querySelector('#cartSection').scrollIntoView();
  }

  login(){
    if(this.mail != null && this.password != null){
      this.message=null;
      this.fireSrv.login(this.mail,this.password)
      .then(ok=>{
        this.mail=null;
        this.password=null;
        this.cookieService.set( 'userLogged', ''+ok.user.uid );
        this.reloadPage()
      })
      .catch(e=>{
          this.errorAlert(e.code);
        })
    }else{
      this.message="Los campos no deben estar vacíos.";
    } 
  }

  reloadPage(){
    window.location.reload();
  }

  errorAlert(code){
    switch (code) {
      case "auth/email-already-in-use":
        this.message="El correo ya se encuentra registrado.";
        break;

      case "auth/invalid-email":
        this.message="Ingresa un correo válido.";
        break;

      case "auth/weak-password":
        this.message="La contraseña debe tener 6 caracteres.";
        break;

      case "auth/wrong-password":
        this.message="La contraseña es incorrecta y/o debe tener 6 caracteres.";
        break;

      case "auth/network-request-failed":
        this.message="Parece que no tienes conexión a internet.";
        break;

      case "auth/user-not-found":
        this.message="Usuario/contraseña incorrectos.";
        break;
      
      default:
        this.message="A ocurrido un problema.";
        break;
    }
    
  }

  remove(Pid,typeData){
    let _tmpList:any=[];//temporal array to list cart

    _tmpList=JSON.parse(localStorage.getItem('listCart'));//get list cart
    //Condition to remove quantity on item
    _tmpList[_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)].quantity-=1;//increase quantity on item 
    if(_tmpList[_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)].quantity==0){
      let _position=_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)
      _tmpList.splice(_position,1)
    }
    localStorage.removeItem('listCart');//remove old list
    localStorage.setItem('listCart',JSON.stringify(_tmpList))//create new list
    
    this.ngOnInit();
  }

  add(Pid,typeData){
    let _tmpList:any=[];//temporal array to list cart

    _tmpList=JSON.parse(localStorage.getItem('listCart'));//get list cart
    //Condition to add quantity on item
    _tmpList[_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)].quantity+=1;//increase quantity on item 
    
    localStorage.removeItem('listCart');//remove old list
    localStorage.setItem('listCart',JSON.stringify(_tmpList))//create new list
    
    this.ngOnInit();
  }

  cellar(){
    this.myCellarWinds=[];//clean array
    if(this.isAuth){
      //function to get cellar by user
      this.fireSrv.getCellarByUserId(this.cookieService.get('userLogged')).subscribe(cellarData=>{
        //If data is null or user have item on cellar
        if(cellarData!=null){
          //array user cellar
          for(let i = 0; i < Object.values(cellarData).length; i++){
            this.myCellarWinds.push({id:Object.values(cellarData)[i].id,quantity:Object.values(cellarData)[i].quantity})//Add items on array
          }
          this.orderCellar();//Order items
          this.clearData();
        }else{
          this.myCellarWinds=[];//clean array
          this.orderCellar();//Order items
          this.clearData();
        }
      })
    }else{
      alert('Debe tener cuenta e iniciar sesión para guardar en su cava.')
    }
  }

  orderCellar(){
    this.itemsCart=[];
    this.itemsCart=JSON.parse(localStorage.getItem('listCart'));
    //Array to order before save on cellar
    for(let i=0; i<this.itemsCart.length;i++){
      if(this.listCart[i].type=="promotion"){
        //Array to get products of promotions 
        for(let j=0; j<Object.keys(this.listCart[i].data.product).length;j++){
          if(this.myCellarWinds.length>0){//if array no have element
            if(this.myCellarWinds.findIndex(data=>data.id==JSON.parse(Object.keys(this.listCart[i].data.product)[j]))==-1){
              let _quantity:number=Number(Object.values(this.listCart[i].data.product)[j])*this.listCart[i].quantity;//temporal variable
              this.myCellarWinds.push({id:JSON.parse(Object.keys(this.listCart[i].data.product)[j]),quantity:_quantity})//Add item on array 
            }else{
              let _quantity:number=Number(Object.values(this.listCart[i].data.product)[j])*this.listCart[i].quantity;//temporal variable
              this.myCellarWinds[this.myCellarWinds.findIndex(data=>data.id==JSON.parse(Object.keys(this.listCart[i].data.product)[j]))].quantity+=_quantity;//Sum quantity
            }
          }else{
            let _quantity:number=Number(Object.values(this.listCart[i].data.product)[j])*this.listCart[i].quantity;//temporal variable
            this.myCellarWinds.push({id:JSON.parse(Object.keys(this.listCart[i].data.product)[j]),quantity:_quantity})//Add item on array
          }
        }
      }else if(this.listCart[i].type=="products"){
        if(this.myCellarWinds.length>0){
          if(this.myCellarWinds.findIndex(data=>data.id==this.listCart[i].id)==-1){
            this.myCellarWinds.push({id:this.listCart[i].id,quantity:this.listCart[i].quantity})//Add item on array
          }else{
            this.myCellarWinds[this.myCellarWinds.findIndex(data=>data.id==this.listCart[i].id)].quantity+=this.listCart[i].quantity;//Sum quantity
          }
        }else{
          this.myCellarWinds.push({id:this.listCart[i].id,quantity:this.listCart[i].quantity})//Add item on array
        }
      }
    }

    if(this.isAuth){
      //Save on celler if user is auth
      for(let i = 0; i < this.myCellarWinds.length; i++){
        this.fireSrv.saveOnMyCellar(this.cookieService.get('userLogged'),this.myCellarWinds[i].id,this.myCellarWinds[i])
      }
    }else{
      alert('Debe tener cuenta e iniciar sesión para guardar en su cava.')
    }
  }
}