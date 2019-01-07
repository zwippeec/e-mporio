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

  constructor(private cookieService: CookieService, private fireSrv:FirebaseService) { }

  ngOnInit() {
    if(this.cookieService.check('userLogged')){
      this.isUserAuth = true;
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
