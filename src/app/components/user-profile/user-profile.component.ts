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

  constructor(private fireSrv:FirebaseService, private cookieService: CookieService,private _router: Router) { }

  ngOnInit() {
    if(this.cookieService.check('userLogged')){
      this.fireSrv.getDataByUser(this.cookieService.get('userLogged')).subscribe(userData=>{
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
}
