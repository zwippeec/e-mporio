import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userData:any={};
  isEditing:boolean=false;
  newUserData:any;
  emailFriend:any=null;
  uid:any;
  constructor(private fireSrv:FirebaseService, private cookieService: CookieService,private _router: Router) { }

  ngOnInit() {
    this.copyCode();
    if(this.cookieService.check('userLogged')){
      this.uid=this.cookieService.get('userLogged');
      this.fireSrv.getDataByUser(this.uid).subscribe(userData=>{
        this.userData=userData;
        this.newUserData=userData;
      });
    }else{
      this._router.navigate(['/login  ']);
    }
  }

  editProfile(){
    this.isEditing=true;
  }

  saveNewData(){
    this.isEditing=false;
    this.fireSrv.updateProfile(this.newUserData,this.cookieService.get('userLogged'));
  }

  send(name,code){
    let mail=this.emailFriend;
    this.fireSrv.saveEmailFriend(this.uid,this.emailFriend);
    let subject="Invitación a E-mporio Store";
    let body=name+', te ha invitado a ser parte de la comunidad E-mporio Store. Ingresa a la siguiente dirección, regístrate y obtén beneficios en tus compras. http://localhost:4200/newUser?code='+code;
    window.open('mailto:'+mail+'?subject='+subject+'&body='+body);
    this.emailFriend=null;
  }

  copyCode(){
    let aux= document.createElement("input");
    aux.setAttribute("value", document.getElementById('urlCode').innerHTML)
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  }
}
