import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mail:any;
  password:any;

  constructor(private fireSrv:FirebaseService, private cookieService: CookieService,private _router: Router) { }

  ngOnInit() {
  }

  login(){
    this.fireSrv.login(this.mail,this.password)
    .then(ok=>{
      this.mail=null;
      this.password=null;
      this.cookieService.set( 'userLogged', 'true' );
      this.reloadPage()
    })
    .catch(e=>console.log('Error: ',e));
  }

  reloadPage(){
    window.location.reload();

    this._router.navigate(['/profile']);
  }

}
