import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FirebaseService } from './service/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-mporio';
  isUserAuth:boolean=false;
  countTotalItems:any=0;
  constructor(private cookieService: CookieService, private fireSrv:FirebaseService) { }

  ngOnInit() {
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
}
