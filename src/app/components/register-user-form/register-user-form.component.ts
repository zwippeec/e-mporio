import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user-form',
  templateUrl: 'register-user-form.component.html',
  styleUrls: ['register-user-form.component.css']
})
export class RegisterUserFormComponent implements OnInit {

  user:any={};
  password:any;
  confirmCreate:boolean=false;
  isUserAuth:boolean=false;
  stringRan="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  code:any='';

  constructor( public fireSrv:FirebaseService, private cookieService: CookieService,private _router: Router) { }

  ngOnInit() {
    for(let i = 0; i < 6; i++){
      this.code+=this.stringRan.charAt(Math.round(Math.random()*this.stringRan.length));
    }
  }

  createUser(){
    this.user.code=this.code;
    console.log(this.user.code)
    this.fireSrv.createNewUser(this.user.mail,this.password, this.user)
    .then(ok=>{
      this.confirmCreate=true;
      this.user={};
      this.password=null;
      this.reloadPage()
    })
    .catch(e=>console.log('Error: ',e));
  }

  reloadPage(){
    window.location.reload();

    this._router.navigate(['/']);
  }
}
