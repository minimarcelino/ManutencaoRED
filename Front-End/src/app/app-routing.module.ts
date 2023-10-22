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
  //cursos
  {
    path: 'csp', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('./csp/csp-routing.module').then((module) => module.CspRoutingModule),
    canActivate: [authorizationService]
  },
  {
    path: 'cra', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('./csp/cursos/cadastrar/cadastrarCurso-routing.module').then((module) => module.cadastrarCursoRoutingModule),
    canActivate: [authorizationService]
  },
  //servidor
  {
    path: 'servidor', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('../app/servidor/servidor.module').then((module) => module.ServidorModule),
    canActivate: [authorizationService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
