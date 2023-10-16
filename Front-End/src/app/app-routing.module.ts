import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authorizationService } from '../app/services/authorization.service'

const routes: Routes = [
  { 
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  //home
  {
    path: 'home', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('../app/home/home.module').then((module) => module.HomeModule),
    canActivate: [authorizationService]
  },
  //login
  {
    path: 'login', component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
