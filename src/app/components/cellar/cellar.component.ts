import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-cellar',
  templateUrl: './cellar.component.html',
  styleUrls: ['./cellar.component.css']
})
export class CellarComponent implements OnInit {
  //suggestion
  suggestionList:any;
  //shipping
  shippingSelect:any=null;
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
  
  constructor(public fireSrv:FirebaseService) { }

  ngOnInit() {
    this.getSuggestion();
  }

  goToShip(){
    console.log(this.shippingSelect)
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
}
