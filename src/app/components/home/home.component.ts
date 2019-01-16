import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listaElementos:any;
  listaTablero:any;
  listaPromociones:any;
  listaSugerencias:any;

  constructor( public fireSrv:FirebaseService) { 
    this.fireSrv.getHomePage().subscribe(resp=>{
      this.listaElementos=resp;
      for(let i = 0; i<resp.length; i++){
        if(resp[i]['tipoElemento']==="slide" && resp[i]['nombreSeccion']==="PromoPaga"){
          this.fireSrv.getPaidPromotion(resp[i]['numElementos']).subscribe(dataPaidPromotion=>{
            this.listaElementos[i]['data']=dataPaidPromotion;
          })
        }
        if(resp[i]['tipoElemento']==="div" && resp[i]['nombreSeccion']==="Tablero"){
          this.fireSrv.getDataBoard(resp[i]['numElementos']).subscribe(dataBoard=>{
            this.listaTablero=dataBoard;
          })
        }
        if(resp[i]['tipoElemento']==="div" && resp[i]['nombreSeccion']==="Promociones"){
          this.fireSrv.getPromotion(resp[i]['numElementos']).subscribe(dataPromotion=>{
            this.listaPromociones=dataPromotion;
          })
        }
        if(resp[i]['tipoElemento']==="div" && resp[i]['nombreSeccion']==="Sugerencias"){
          this.fireSrv.getSuggestion(resp[i]['numElementos']).subscribe(dataSuggestion=>{
            this.listaSugerencias=dataSuggestion;
          })
        }
      }
    });
  }

  ngOnInit() {
    
  }

}
