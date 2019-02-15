import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { Router,ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

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
  codeInvitation:any='';
  userCode:any='';
  userReferencial:any=null;

  constructor( public fireSrv:FirebaseService, private cookieService: CookieService,private activeRouter: ActivatedRoute,private _router: Router) { }

  ngOnInit() {
    let _code=this.activeRouter
    .queryParamMap
    .pipe(map(params=>params.get('code') || null));
    this.codeInvitation=_code['destination']['source']['_value'].code;
    
    if(this.codeInvitation!=undefined){
      this.fireSrv.getUserByCode(this.codeInvitation).then(userData=>{
        this.userReferencial=Object.keys(userData.val())[0]
      });
    }

    for(let i = 0; i < 6; i++){
      this.userCode+=this.stringRan.charAt(Math.round(Math.random()*this.stringRan.length));
    }
  }

  createUser(){
    this.user.code=this.userCode;
    this.user.codeInvitation=this.codeInvitation;
    
    this.fireSrv.createNewUser(this.user.mail,this.password, this.user,this.userReferencial)
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
