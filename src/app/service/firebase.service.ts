import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public afDb:AngularFireDatabase, public afAuth:AngularFireAuth , private cookieService:CookieService) { }

  createNewUser(mail,pass,data){
    return this.afAuth.auth.createUserWithEmailAndPassword(mail,pass)
    .then(userOk=>{
      this.cookieService.set( 'userLogged', ''+userOk.user.uid );
      this.afDb.object('user/'+userOk.user.uid).set(data);
    })
    .catch(e=>console.log('Error: ', e ))
  }

  logout(){
    return this.afAuth.auth.signOut();
  }

  login(mail,password){
    return this.afAuth.auth.signInWithEmailAndPassword(mail,password)
  }

  getDataByUser(uid){
    return this.afDb.object('user/'+uid).valueChanges();
  }
}
