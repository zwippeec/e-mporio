import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public afDb:AngularFireDatabase, public afAuth:AngularFireAuth , private cookieService:CookieService) { }

  //Login and register
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
  //User
  getDataByUser(uid){
    return this.afDb.object('user/'+uid).valueChanges();
  }

  updateProfile(newUserData,uid){
    return this.afDb.object('user/'+uid).update(newUserData);
  }
  //Products
  getAllProducts(){
    return this.afDb.list('products').valueChanges();
  }

  getProducByCode(code){
    return this.afDb.list('products/', ref => ref.orderByChild("code").equalTo(code)).valueChanges();
  }
  
  getProducById(Pid){
    return this.afDb.object('products/'+Pid).valueChanges();
  }

  //Wishes list
  addItemWishesList(uid,pid,name){
    if(name==null){
      name='Mi lista';
    }
    return this.afDb.object('user/'+uid+'/wishesList/'+name+'/'+pid).set(true);
  }

  getWishesList(uid){
    return this.afDb.object('user/'+uid+'/wishesList/').valueChanges();
  }

  removeItemWishesList(uid,pid,name){
    return this.afDb.list('user/'+uid+'/wishesList/'+name+'/'+pid).remove();
  }

  //Dinamic Pages TEST

  getHomePage(){
    return this.afDb.list('Pages/Home', ref=>ref.orderByChild('orden')).valueChanges();
  }

  getPaidPromotion(limit){
    return this.afDb.list('PromocionPagada', ref=>ref.limitToFirst(limit)).valueChanges();
  }

  getDataBoard(limit){
    return this.afDb.list('Tablero', ref=>ref.limitToFirst(limit)).valueChanges();
  }

  getPromotion(limit){
    return this.afDb.list('Promociones', ref=>ref.limitToFirst(limit)).valueChanges();
  }

  getSuggestion(limit){
    return this.afDb.list('Sugerencias', ref=>ref.limitToFirst(limit)).valueChanges();
  }
}
