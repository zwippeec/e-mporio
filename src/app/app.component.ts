
import { CookieService } from 'ngx-cookie-service';
import { FirebaseService } from './service/firebase.service';
import {Component, ViewChild} from "@angular/core";
import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutoCompleteComponent} from "ng-auto-complete";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(NgAutoCompleteComponent) public autocompleter: NgAutoCompleteComponent;

  title = 'e-mporio';
  isUserAuth:boolean=false;
  countTotalItems:any=0;
  public group = [];

  constructor(private cookieService: CookieService, private fireSrv:FirebaseService,private _router: Router) { }

  ngOnInit() {
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
      if(localStorage.getItem('listCart')){
        this.countTotalItems=JSON.parse(localStorage.getItem('listCart')).length;
      }
    }else{
      this.isUserAuth = false;
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
}
