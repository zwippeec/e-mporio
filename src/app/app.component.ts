
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
      this.uid=this.cookieService.get('userLogged');
      if(localStorage.getItem('listCart')){
        this.countTotalItems=JSON.parse(localStorage.getItem('listCart')).length;
      }
      this.fireSrv.getDataByUser(this.uid).subscribe(userData=>{
        if(userData['favorite']==null || userData['favorite']== undefined){
          setTimeout(()=>{
            this.openModalBtn.nativeElement.click();
          },5000);
        }
      });
    }else{
      this.isUserAuth = false;
      if(localStorage.getItem('favoriteList')==null){
        setTimeout(()=>{
          this.openModalBtn.nativeElement.click();
        },5000);
      }
    }
  }

  logout(){
    this.cookieService.delete('userLogged','/','localhost')
    this.isUserAuth=false;  
    this.fireSrv.logout();
    window.location.reload();
  }

  Selected(item: SelectedAutocompleteItem) {
    window.location.reload()
    this._router.navigate(['/products',item.item.original.code]);
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

  selectOption(event){
    if(event.target.checked){
      this.optionSurvey.push(event.target.value);
    }else{
      this.optionSurvey.splice(this.optionSurvey.indexOf(event.target.value),1);
    }
  }

  saveSurvey(){
    if(this.isUserAuth){
      this.fireSrv.setFavoritesData(this.uid,this.optionSurvey);
    }else{
      localStorage.setItem('favoriteList',this.optionSurvey);
    }
  }
}
