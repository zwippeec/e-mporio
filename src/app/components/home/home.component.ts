import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  elementList:any;
  boardList:any;
  promotionList:any;
  suggestionList:any;

  constructor( public fireSrv:FirebaseService) { 
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
          })
        }
        if(resp[i]['elementType']==="Div" && resp[i]['sectionName']==="Sugerencias"){
          this.fireSrv.getSuggestion(resp[i]['numsElements']).subscribe(dataSuggestion=>{
            this.suggestionList=dataSuggestion;
          })
        }
      }
    });
  }

  ngOnInit() {
    
  }

}
