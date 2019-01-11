import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { UsComponent } from './components/us/us.component';
import { RegisterUserFormComponent } from './components/register-user-form/register-user-form.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { WishesListComponent } from './components/wishes-list/wishes-list.component';

const routes: Routes = [
  {path:'home', component:HomeComponent},
  {path:'us', component:UsComponent},
  {path:'newUser', component:RegisterUserFormComponent},
  {path:'login', component:LoginComponent},
  {path:'profile', component:UserProfileComponent},
  {path:'products', component:ProductComponent},
  {path:'products/:id', component:ProductDetailComponent},
  {path:'cart', component:ShoppingCartComponent},
  {path:'wishes', component:WishesListComponent},
  {path:'**', pathMatch:'full', redirectTo:'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
