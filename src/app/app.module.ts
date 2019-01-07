import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { FirebaseService } from './service/firebase.service';
//Forms
import { FormsModule } from '@angular/forms';
//Cookies
import { CookieService } from 'ngx-cookie-service';
//Pages
import { HomeComponent } from './components/home/home.component';
import { UsComponent } from './components/us/us.component';
import { RegisterUserFormComponent } from './components/register-user-form/register-user-form.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsComponent,
    RegisterUserFormComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule
  ],
  providers: [
    FirebaseService,
    AngularFireDatabase,
    CookieService,
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
