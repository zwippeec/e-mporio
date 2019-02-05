import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

  constructor( public fireSrv:FirebaseService,private cookieService: CookieService) { }

  ngOnInit() {

    if(this.cookieService.check('userLogged')){
      this.uid=this.cookieService.get('userLogged');
      this.isAuth=true;
    }else{
      this.isAuth=false;
    }

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
        if(resp[i]['elementType']==="Div" && resp[i]['sectionName']==="Sugerencias"){
          if(this.isAuth){
            this.fireSrv.getFavoritesByUser(this.uid).subscribe(userData=>{
              for(let i = 1; i<userData.length;i++){
                this.favorites.push(userData[i]);
              }
            })
            this.fireSrv.getAllProducts().subscribe(productsData=>{
              for(let i = 0; i < productsData.length; i++){
                for(let j = 0; j < this.favorites.length; j++){
                  if(productsData[i]['windKind']==this.favorites[j]){
                    this.suggestionList.push(productsData[i])
                  }
                }
              }
            });
          }else{
            if(localStorage.getItem('favoriteList')){
              let _tmpList=localStorage.getItem('favoriteList').split(',');
              for(let i = 0; i < _tmpList.length; i++){
                this.favorites.push(_tmpList[i]);
              }

              this.fireSrv.getAllProducts().subscribe(productsData=>{
                for(let i = 0; i < productsData.length; i++){
                  for(let j = 0; j < this.favorites.length; j++){
                    if(productsData[i]['windKind']==this.favorites[j]){
                      this.suggestionList.push(productsData[i])
                    }
                  }
                }
              });

            }else{
              this.fireSrv.getSuggestion(resp[i]['numsElements']).subscribe(dataSuggestion=>{
                this.suggestionList=dataSuggestion;
              })
            }
          }
        }
      }
    });
  }

  addCart(Pid,typeData){
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
  }
}