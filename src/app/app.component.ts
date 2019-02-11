
import { CookieService } from 'ngx-cookie-service';
import { FirebaseService } from './service/firebase.service';
import { Component, ViewChild, ElementRef } from "@angular/core";
import { CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutoCompleteComponent } from "ng-auto-complete";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(NgAutoCompleteComponent) public autocompleter: NgAutoCompleteComponent;
  @ViewChild("openModalBtn") openModalBtn:ElementRef;

  title = 'e-mporio';
  isUserAuth:boolean=false;
  countTotalItems:any=0;
  uid:any;
  _dateCookie:Date=new Date();
  //Survey
  surveyData:any={
    title:''
  };
  optionSurvey:any=[];
  //Menu Winds
  menuWindsTypeGrapes:any=[];
  menuWindsCountries:any=[];
  menuWindsType:any=[];
  menuWindsCellar:any=[];
  menuWindsRegion:any=[];
  //Menu Espirituals
  menuEspiritualsBrand:any=[];
  menuEspiritualsCountries:any=[];
  menuEspiritualsType:any=[];
  //Menu Accesories
  menuAccesoriesBrand:any=[];
  menuAccesoriesCountries:any=[];
  menuAccesoriesType:any=[];
  //Payment Type
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
  public group = [];

  constructor(private cookieService: CookieService, private fireSrv:FirebaseService,private _router: Router) { }

  ngOnInit() {
    this.getMenu();

    this.fireSrv.getSurvey().subscribe(surveyData=>{
      this.surveyData=surveyData;
    });
    this.fireSrv.getAllProducts().subscribe(productsData=>{
      this.group = [
        CreateNewAutocompleteGroup(
          'Buscar...',
          'autocompleter',
          productsData,
          {titleKey: 'name', childrenKey: null}
        ),
      ];
    });
    
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
      this.uid=this.cookieService.get('userLogged');//Get user data
      if(localStorage.getItem('listCart')){
        this.countTotalItems=JSON.parse(localStorage.getItem('listCart')).length;//Count items on cart
      }
      //Get favorite list
      this.fireSrv.getDataByUser(this.uid).subscribe(userData=>{
        //If not exists favorite list (attribute/firebase)
        if(userData['favorite']==null || userData['favorite']== undefined){
          setTimeout(()=>{
            this.openModalBtn.nativeElement.click();//automatic click on buttom to open modal (survey)
          },5000);
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
      this.isUserAuth = false;
      //User not Auth
      if(localStorage.getItem('createList')){
        let _tmpLocalDate=localStorage.getItem('createList');//get data to last visit
        let _now=this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDay()//nowaday
        //Remove data saved
        if(_now!=_tmpLocalDate){
          localStorage.removeItem('createList');
          localStorage.removeItem('favoriteList');
        }
      }
      //If not exists favorite list (local)
      if(localStorage.getItem('favoriteList')==null){
        setTimeout(()=>{
          this.openModalBtn.nativeElement.click();//automatic click on buttom to open modal (survey)
        },5000);
      }
    }
  }

  logout(){
    this.cookieService.delete('userLogged','/','localhost')//delete cookie
    this.isUserAuth=false; //change status
    this.fireSrv.logout(); //logout session
    window.location.reload();//reload page
  }
  //function to select item on autocomplete
  Selected(item: SelectedAutocompleteItem){
    window.location.reload()//reload page
    this._router.navigate(['/products',item.item.original.code]);//redirect to url (products) and pass data
  }

  getMenu(){
    this.fireSrv.getPrincipalMenu().subscribe(menuData=>{
      //Winds
      this.menuWindsCellar=menuData['WindsWorld']['cellar'];
      this.menuWindsCountries=menuData['WindsWorld']['countries'];
      this.menuWindsRegion=menuData['WindsWorld']['region'];
      this.menuWindsType=menuData['WindsWorld']['type'];
      this.menuWindsTypeGrapes=menuData['WindsWorld']['typeGrapes'];
      //Espiritual
      this.menuEspiritualsBrand=menuData['EspiritualWorld']['brand'];
      this.menuEspiritualsCountries=menuData['EspiritualWorld']['countries'];
      this.menuEspiritualsType=menuData['EspiritualWorld']['type'];
      //Accesories
      this.menuAccesoriesBrand=menuData['Accessories']['brand'];
      this.menuAccesoriesCountries=menuData['Accessories']['countries'];
      this.menuAccesoriesType=menuData['Accessories']['type'];
    });
  }

  goToProducts(item){
    this._router.navigate(['/products',item]);
  }
  //function to add options on survey
  selectOption(event){
    //Add first element (date)
    if(this.isUserAuth && this.optionSurvey.length==0){
      this.optionSurvey.push(this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDate());
    }
    if(event.target.checked){ 
      this.optionSurvey.push(event.target.value);//add options on array
    }else{
      this.optionSurvey.splice(this.optionSurvey.indexOf(event.target.value),1);//delete option on array
    }
  }

  saveSurvey(){
    if(this.isUserAuth){
      this.fireSrv.setFavoritesData(this.uid,this.optionSurvey);//Save data on Firebase
    }else{
      let _date=this._dateCookie.getFullYear()+"-"+(this._dateCookie.getMonth()+1)+"-"+this._dateCookie.getDay()//Save data local
      localStorage.setItem('favoriteList',this.optionSurvey);//create list
      localStorage.setItem('createList',_date);//date
    }
  }
}
