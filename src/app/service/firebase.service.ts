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
  setFavoritesData(uid,data){
    return this.afDb.object('user/'+uid+'/favorite').set(data);
  }
  erasedFavorite(uid){
    return this.afDb.object('user/'+uid+'/favorite').remove();
  }
  getFavoritesByUser(uid){
    return this.afDb.list('user/'+uid+'/favorite').valueChanges();
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

  getProducByIdPay(node,Pid){
    return this.afDb.object(node+"/"+Pid).valueChanges();
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
    return this.afDb.list('Pages/Home', ref=>ref.orderByChild('order')).valueChanges();
  }

  getPaidPromotion(limit){
    return this.afDb.list('paidPromotion', ref=>ref.limitToFirst(limit).orderByChild('status').equalTo("active")).valueChanges();
  }

  getDataBoard(limit){
    return this.afDb.list('Tablero', ref=>ref.limitToFirst(limit)).valueChanges();
  }

  getPromotion(limit){
    return this.afDb.list('promotion', ref=>ref.limitToFirst(limit)).valueChanges();
  }

  getSuggestion(limit){
    return this.afDb.list('products', ref=>ref.limitToFirst(limit).orderByChild('monthSuggestion').equalTo(true)).valueChanges();
  }
  
  //pay method
  payOrder(uid,data){
    return this.afDb.list('binnacle/'+uid).push(data);
  }

  //Packs
  getPacks(){
    return this.afDb.list('packs').valueChanges();
  }
  
  //Cellar
  saveOnMyCellar(uid,data){
    return this.afDb.object ('cellar/'+uid).set(data);
  }
  
  //Principal Menu
  getPrincipalMenu(){
    return this.afDb.object('PrincipalMenu').valueChanges();
  }

  //Survey
  getSurvey(){
    return this.afDb.object('Survey').valueChanges();
  }
  //Historial
  getHistorialByUserId(uid){
    return this.afDb.list('binnacle/'+uid).valueChanges();
  }
  getHistorialByUserIdObjects(uid){
    return this.afDb.object('binnacle/'+uid).valueChanges();
  }
  getHistorialByOrder(uid,order){
    return this.afDb.object('binnacle/'+uid+'/'+order).valueChanges();
  }
}
