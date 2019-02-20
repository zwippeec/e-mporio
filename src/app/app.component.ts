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
    this.authUser();
    this.getMenu();
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
  }

  authUser(){
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
      this.uid=this.cookieService.get('userLogged');//Get user data
      if(localStorage.getItem('listCart')){
        this.countTotalItems=JSON.parse(localStorage.getItem('listCart')).length;//Count items on cart
      }
    }else{
      this.isUserAuth = false;
      if(localStorage.getItem('listCart')){
        this.countTotalItems=JSON.parse(localStorage.getItem('listCart')).length;//Count items on cart
      }
    }
  }

  logout(){
    this.cookieService.delete('userLogged','/','localhost')//delete cookie
    this.isUserAuth=false; //change status
    this.fireSrv.logout(); //logout session
    localStorage.removeItem('listCart');//remove list
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
}
