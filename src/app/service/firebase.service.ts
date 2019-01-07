import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public afDb:AngularFireDatabase, public afAuth:AngularFireAuth) { }

  createNewUser(mail,pass,data){
    return this.afAuth.auth.createUserWithEmailAndPassword(mail,pass)
    .then(userOk=>{
      this.afDb.object('user/'+userOk.user.uid).set(data);
    })
    .catch(e=>console.log('Error: ', e ))
  }
}
