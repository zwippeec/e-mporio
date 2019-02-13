import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../service/firebase.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reference-person',
  templateUrl: './reference-person.component.html',
  styleUrls: ['./reference-person.component.css']
})
export class ReferencePersonComponent implements OnInit {

  suggestionPerson:any=[];
  isAuth:boolean=false;
  uid:any=null;
  constructor(public fireSrv: FirebaseService,private cookieService: CookieService,private _router:Router) {}

  ngOnInit() {
    
    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
      this.uid=this.cookieService.get('userLogged');
      this.fireSrv.getSuggestionPerson(this.uid).subscribe(suggestionPersonData=>{
        this.suggestionPerson=Object.keys(suggestionPersonData);
      });
    }else{
      this.isAuth=false;
    }

    
  }

}
