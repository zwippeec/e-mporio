import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productsData:any;
  isUserAuth:boolean=false;
  nameList:any=null;
  wishesDataList:any=[];
  wishesList:any=[];
  wishesListSelect:any=null;
  productId:any;
  saveOnWishesList:boolean=false;
  errorAuth:boolean=false;

  promotionList:any;
  timerPromotion:any=[];
  horas;
  minuto;
  segundos; 
  intervalo;
  //Info cart
  listCart:any=[];
  itemsCart:any=[];
  subtotalPay:any=0.00;
  showInfoCart:boolean=true;//show or hide info

  //filters
  //filters:any={windKind:'',cost:'',foodFilter:'',moodFilter:'',styleFilter:'',cellerFilter:'',grapeFilter:'',regionFilter:'',countryFilter:''};
    filters:any={windKind:'',country:'',region:'',cellar:''};
  constructor(public fireSrv: FirebaseService,private cookieService: CookieService,private modalService: NgbModal,private _router: Router,private _route: ActivatedRoute,) { 
    this.allProducts();
    this.getPromotion();
  }

  ngOnInit() {
    this.listCart=[];
    //get params on url
    this._route.queryParams.subscribe(params=>{
      //add param on filter windKind
      if(params['windKind']!=null){
        this.filters.windKind=params['windKind'];
      }
      //add param on filter country
      if(params['country']!=null){
        this.filters.country=params['country'];
      }
      //add param on filter region
      if(params['region']!=null){
        this.filters.region=params['region'];
      }
      //add param on filter cellar
      if(params['cellar']!=null){
        this.filters.cellar=params['cellar'];
      }
    })
    //Compare if session is active
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
      this.getWishesList();//Get wishes list
    }else{
      this.isUserAuth = false;
    }

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
    this.fireSrv.getWishesList(this.cookieService.get('userLogged')).subscribe(wishes=>{
      this.wishesList=[];
      this.wishesDataList=[];
      for(let i = 0; i < Object.keys(wishes).length; i++){
        this.wishesList.push(Object.keys(wishes)[i]);
      }
    });
  }

  allProducts(){
    this.fireSrv.getAllProducts().subscribe(productsData=>{
      this.productsData=productsData;
    });
  }

  addWishesList(){
    if(this.isUserAuth){
      if(this.wishesListSelect!=null){
        this.nameList=this.wishesListSelect;
      }
      this.fireSrv.addItemWishesList(this.cookieService.get('userLogged'),this.productId,this.nameList).then(resOk=>{
        this.nameList=null;
        this.productId=null;
        this.saveOnWishesList=true;
        this.wishesListSelect=null;
        this.closeModal();
      });
    }else{
      this.errorAuth=true;
      this.closeModal();
    }
  }

  removeWishesList(codeId){
    this.fireSrv.removeItemWishesList(this.cookieService.get('userLogged'),codeId,this.nameList);
  }
  
  openModal(content, idP) {
    this.errorAuth=false;
    this.saveOnWishesList=false;
    this.productId=idP;
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  closeModal(){
    this.modalService.dismissAll();
    this.getWishesList();
  }

  addCart(Pid,typeData){
    this.showInfoCart=false;
    let items:any=[];//array to first object
    let _tmpList:any=[];//temporal array to list cart
    //Condition if exits listCart or create new list
    if(localStorage.getItem('listCart')!=null){
      _tmpList=JSON.parse(localStorage.getItem('listCart'));//get list cart
      //Condition to add item or increase quantity on item
      if(_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)!=-1){
        _tmpList[_tmpList.findIndex(data=>data.id===Pid && data.type===typeData)].quantity+=1;//increase quantity on item 
      }else{
        _tmpList.push({id:Pid,quantity:1,type:typeData})//add item on list if no exist
      } 
      localStorage.removeItem('listCart');//remove old list
      localStorage.setItem('listCart',JSON.stringify(_tmpList))//create new list
    }else{
      items.push({id:Pid,quantity:1,type:typeData});//first item on list
      localStorage.setItem('listCart',JSON.stringify(items))//create list
    }
    this.ngOnInit();
  }

  getPromotion(){
    this.fireSrv.getPromotion(3).subscribe(dataPromotion=>{
      this.promotionList=dataPromotion;
      for(let i = 0; i<dataPromotion.length;i++){
        this.timerPromotion.push({id:i, endDate:dataPromotion[i]['endDate']})
      }
      //BeginTimer//Display timer
      this.intervalo=window.setInterval(()=>{
        for(let i = 0; i<this.timerPromotion.length; i++){
          let now = new Date();  //Get nowaday
          let clock = new Date(this.timerPromotion[i].endDate); // Obtener la fecha y almacenar en clock  
          let day=clock.getUTCDate()-now.getUTCDate();//Get day
          let cont=false;
          if(day>=0){
            this.horas=day*24;//cuando dia sea mayor a 0
            this.horas+=clock.getHours() - now.getHours();//Sum hours with days
            if(this.horas>=0){
              if(clock.getMinutes() >= now.getMinutes()){
                this.minuto = clock.getMinutes()-1 - now.getMinutes();//Get minutos
                if(clock.getSeconds() >= now.getSeconds()){
                  this.segundos = clock.getSeconds() - now.getSeconds();//Get seconds
                } else if(clock.getSeconds() < now.getSeconds()){ 
                  this.segundos = clock.getSeconds()+60 - now.getSeconds();//Get seconds
                }
              } else if(clock.getMinutes() < now.getMinutes()){
                this.minuto = clock.getMinutes()+60 - now.getMinutes();//Get minutos
                if(clock.getSeconds() >= now.getSeconds()){
                  this.segundos = clock.getSeconds() - now.getSeconds();//Get   seconds
                } else if(clock.getSeconds() < now.getSeconds()){ 
                  this.segundos = clock.getSeconds()+60 - now.getSeconds();//Get seconds
                }
              }
              if(this.horas==1){
                this.horas=0;
              }
              if(this.minuto<0){
                this.minuto="0"+0;
                cont=true;
              }
              if(this.horas == "0" && this.minuto <= "00" && cont){
                this.promotionList[i].time="00:00:00";
                cont=false
                this.timerPromotion.splice(i,1)
              }else{
                this.promotionList[i].time=this.horas+":"+this.minuto+":"+this.segundos;
              }
            }else{
              this.horas=0;
              this.minuto=0;
              this.segundos=0;
            }
          }else{
            clearTimeout(this.intervalo);
            this.timerPromotion.splice(i,1)
          }
        }
      }, 1000);// Frecuencia de actualización;
      //endTimer
    })
  }

  hideInfoCart(){
    this.showInfoCart=true;
  }
}