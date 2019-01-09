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
  mail:any=null;
  password:any=null;
  message:any=null;

  constructor(private fireSrv:FirebaseService, private cookieService: CookieService,private _router: Router) { }

  ngOnInit() {
  }

  login(){
    if(this.mail != null && this.password != null){
      this.message=null;
      this.fireSrv.login(this.mail,this.password)
      .then(ok=>{
        this.mail=null;
        this.password=null;
        this.cookieService.set( 'userLogged', ''+ok.user.uid );
        console.log(this.cookieService.get('userLogged'))
        this.reloadPage()
      })
      .catch(e=>{
          this.errorAlert(e.code);
          console.log('2 Error: ',e)
        })
    }else{
      this.message="Los campos no deben estar vacíos.";
    } 
  }

  reloadPage(){
    window.location.reload();

    this._router.navigate(['/profile']);
  }

  errorAlert(code){
    switch (code) {
      case "auth/email-already-in-use":
        this.message="El correo ya se encuentra registrado.";
        break;

      case "auth/invalid-email":
        this.message="Ingresa un correo válido.";
        break;

      case "auth/weak-password":
        this.message="La contraseña debe tener 6 caracteres.";
        break;

      case "auth/wrong-password":
        this.message="La contraseña es incorrecta y/o debe tener 6 caracteres.";
        break;

      case "auth/network-request-failed":
        this.message="Parece que no tienes conexión a internet.";
        break;

      case "auth/user-not-found":
        this.message="Usuario/contraseña incorrectos.";
        break;
      
      default:
        this.message="A ocurrido un problema.";
        break;
    }
    
  }

}
