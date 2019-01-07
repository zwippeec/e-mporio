import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-register-user-form',
  templateUrl: 'register-user-form.component.html',
  styleUrls: ['register-user-form.component.css']
})
export class RegisterUserFormComponent implements OnInit {

  user:any={};
  password:any;
  confirmCreate:boolean=false;
  constructor( public fireSrv:FirebaseService) { }

  ngOnInit() {
  }

  createUser(){
    this.fireSrv.createNewUser(this.user.mail,this.password, this.user)
    .then(ok=>{
      this.confirmCreate=true;
      this.user={};
      this.password=null;
    })
    .catch(e=>console.log('Error: ',e));
  }

}
