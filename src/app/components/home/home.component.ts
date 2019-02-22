import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','../../../flags.css','../../../flags.min.css']
})
export class HomeComponent implements OnInit {
  @ViewChild("openModalBtn") openModalBtn:ElementRef;
  
  elementList:any;
  boardList:any;
  promotionList:any;
  suggestionList:any=[];
  timerPromotion:any=[];
  horas;
  minuto;
  segundos; 
  intervalo;
  uid:any;//user id
  isAuth:boolean=false;//auth user
  favorites:any=[];//favorite list by user
  listCart:any=[];
  itemsCart:any=[];
  subtotalPay:any=0.00;
  showInfoCart:boolean=true;//show or hide info
  quantityProd:number=1;
  //Survey
  countTotalItems:any=0;
  _dateCookie:Date=new Date();
  surveyData:any={
    title:''
  };
  optionSurvey:any=[];
  countSurvey:number=0;

  constructor( public fireSrv:FirebaseService,private cookieService: CookieService) {
    this.fireSrv.getHomePage().subscribe(resp=>{
      this.elementList=resp;
      for(let i = 0; i<resp.length; i++){
        if(resp[i]['elementType']==="Slide" && resp[i]['sectionName']==="PromoPaga"){
          this.fireSrv.getPaidPromotion(resp[i]['numsElements']).subscribe(dataPaidPromotion=>{
            this.elementList[i]['data']=dataPaidPromotion;
          })
        }
        if(resp[i]['elementType']==="Div" && resp[i]['sectionName']==="Tablero"){
          this.fireSrv.getDataBoard(resp[i]['numsElements']).subscribe(dataBoard=>{
            this.boardList=dataBoard;
          })
        }
        if(resp[i]['elementType']==="Div" && resp[i]['sectionName']==="Promociones"){
          this.fireSrv.getPromotion(resp[i]['numsElements']).subscribe(dataPromotion=>{
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
                if(now <= clock){
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
                }else{
                  this.horas=0;
                  this.minuto=0;
                  this.segundos=0;
                  this.promotionList[i].time="00:00:00";
                }            
              }
            }, 1000);// Frecuencia de actualización;
            //endTimer
          })
        }
        if(resp[i]['elementType']==="Div" && resp[i]['sectionName']==="Sugerencias"){
          if(this.isAuth){
            this.fireSrv.getFavoritesByUser(this.uid).subscribe(userData=>{
              for(let i = 1; i<userData.length;i++){
                this.favorites.push(userData[i]);
              }
            })
            if(this.favorites.length>0){
              this.fireSrv.getAllProducts().subscribe(productsData=>{
                //user log and survey
                for(let i = 0; i < productsData.length; i++){
                  for(let j = 0; j < this.favorites.length; j++){
                    if(productsData[i]['windKind']==this.favorites[j] && this.suggestionList.length<3){
                      this.suggestionList.push(productsData[i]);
                    }
                  }
                }
              });
            }else{
              this.fireSrv.getSuggestion(resp[i]['numsElements']).subscribe(dataSuggestion=>{
                this.suggestionList=dataSuggestion;
              })
            }
          }else{
            if(localStorage.getItem('favoriteList')){
              let _tmpList=localStorage.getItem('favoriteList').split(',');
              for(let i = 0; i < _tmpList.length; i++){
                this.favorites.push(_tmpList[i]);
              }
              this.fireSrv.getAllProducts().subscribe(productsData=>{
                //user log and not survey
                for(let i = 0; i < productsData.length; i++){
                  for(let j = 0; j < this.favorites.length; j++){
                    if(productsData[i]['windKind']==this.favorites[j]){
                      this.suggestionList.push(productsData[i])
                    }
                  }
                }
              });
            }else{
              //user not log and not survey
              this.fireSrv.getSuggestion(resp[i]['numsElements']).subscribe(dataSuggestion=>{
                this.suggestionList=dataSuggestion;
              })
            }
          }
        }
      }
    });
  }

  ngOnInit() {
    this.fireSrv.getSurvey().subscribe(surveyData=>{
      this.surveyData=surveyData;
    });
    this.listCart=[];
    if(this.cookieService.check('userLogged')){
      this.uid=this.cookieService.get('userLogged');
      this.isAuth=true;
    }else{
      this.isAuth=false;
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
  @HostListener('window:scroll', []) // for window scroll events
  userScroll(){
    let _scroll=document.documentElement.scrollTop || document.body.scrollTop;
    if(_scroll>960 && this.countSurvey==0){
      this.surveyLauch();
      this.countSurvey+=1;
    }
  }

  surveyLauch(){
    if(this.cookieService.check('userLogged')){
      this.uid=this.cookieService.get('userLogged');//Get user data
      //Get favorite list
      this.fireSrv.getDataByUser(this.uid).subscribe(userData=>{
        //If not exists favorite list (attribute/firebase)
        if(userData['favorite']==null || userData['favorite']== undefined){
          this.openModalBtn.nativeElement.click();//automatic click on buttom to open modal (survey)
        }
        //Delete favorite data of user log
        /*else{
          let _now=this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDate();
          if(_now!=userData['favorite'][0]){
            this.fireSrv.erasedFavorite(this.uid);
          }
        }*/
      });
    }else{
      //User not Auth
      if(localStorage.getItem('createList')){
        let _tmpLocalDate=localStorage.getItem('createList');//get data to last visit
        let _now=this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDate()//nowaday
        //Remove data saved
        if(_now!=_tmpLocalDate){
          localStorage.removeItem('createList');
          localStorage.removeItem('favoriteList');
        }
      }
      //If not exists favorite list (local)
      if(localStorage.getItem('favoriteList')==null){
        this.openModalBtn.nativeElement.click();//automatic click on buttom to open modal (survey)
      }
    }
  }

  //function to add options on survey
  selectOption(event){
    //Add first element (date)
    if(this.isAuth && this.optionSurvey.length==0){
      this.optionSurvey.push(this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDate());
    }
    if(event.target.checked){ 
      this.optionSurvey.push(event.target.value);//add options on array
    }else{
      this.optionSurvey.splice(this.optionSurvey.indexOf(event.target.value),1);//delete option on array
    }
  }

  saveSurvey(){
    if(this.isAuth){
      this.fireSrv.setFavoritesData(this.uid,this.optionSurvey);//Save data on Firebase
    }else{
      let _date=this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDate()//Save data local
      localStorage.setItem('favoriteList',this.optionSurvey);//create list
      localStorage.setItem('createList',_date);//date
    }
  }
}