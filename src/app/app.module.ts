import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Autocomplete
import {NgAutoCompleteModule} from "ng-auto-complete";
//Filter
import { FilterPipeModule } from 'ngx-filter-pipe';
//Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { WishesListComponent } from './components/wishes-list/wishes-list.component';
import { ShoppingHistoryComponent } from './components/shopping-history/shopping-history.component';
import { ShoppingHistoryDetailComponent } from './components/shopping-history-detail/shopping-history-detail.component';
import { ReferencePersonComponent } from './components/reference-person/reference-person.component';
import { CellarComponent } from './components/cellar/cellar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsComponent,
    RegisterUserFormComponent,
    LoginComponent,
    UserProfileComponent,
    ProductComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    WishesListComponent,
    ShoppingHistoryComponent,
    ShoppingHistoryDetailComponent,
    ReferencePersonComponent,
    CellarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    NgbModule,
    NgAutoCompleteModule,
    FilterPipeModule
  ],
  providers: [
    FirebaseService,
    AngularFireDatabase,
    CookieService,
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }