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
  suggestionPersonInactive:any=[];
  constructor(public fireSrv: FirebaseService,private cookieService: CookieService,private _router:Router) {}

  ngOnInit() {
    if(this.cookieService.check('userLogged')){
      this.isAuth=true;
      this.uid=this.cookieService.get('userLogged');
      this.fireSrv.getSuggestionPersonByEmail(this.uid).subscribe(emailsData=>{
        this.suggestionPerson=[];
        this.suggestionPersonInactive=[];
        for(let i = 0; i<emailsData.length; i ++){
          this.fireSrv.getAllUser(emailsData[i]).valueChanges().subscribe(personData=>{
            if(personData.length>0){
              this.suggestionPerson.push(personData)
            }else{
              console.log('Inactive',emailsData[i])
              this.suggestionPersonInactive.push(emailsData[i])
            }
          });
        }
      })
      console.log(this.suggestionPerson)
      /*this.fireSrv.getSuggestionPerson(this.uid).subscribe(suggestionPersonData=>{
        //this.suggestionPerson=Object.keys(suggestionPersonData);
        for(let i = 0; i < Object.keys(suggestionPersonData).length; i++){
          //console.log(Object.keys(suggestionPersonData)[i])
          this.fireSrv.getDataByUser(Object.keys(suggestionPersonData)[i]).subscribe(userDataRef=>{
            //console.log(userDataRef)
            this.suggestionPerson.push(userDataRef)
          })
        }
      });*/
    }else{
      this.isAuth=false;
    }
    
  }

}
