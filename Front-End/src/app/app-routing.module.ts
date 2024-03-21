import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authorizationService } from '../app/services/authorization.service'

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  //login
  {
    path: 'login', component: LoginComponent
  },
  //csp
  {
    path: 'csp',
    loadChildren: () => import('./csp/csp-routing.module').then((module) => module.CspRoutingModule),
    canActivate: [authorizationService]
  },
  //cra
  {
    path: 'cra',
    loadChildren: () => import('./cra/cra-routing.module').then((module) => module.CraRoutingModule),
    canActivate: [authorizationService]
  },
  //coordenador
  {
    path: 'coordenador',
    loadChildren: () => import('./coordenador/coordenador-routing.module').then((module) => module.CoordenadorRoutingModule),
    canActivate: [authorizationService]
  },
  //professor
  {
    path: 'professor',
    loadChildren: () => import('./professor/professor-routing.module').then((module) => module.ProfessorRoutingModule),
    canActivate: [authorizationService]
  },
  //usuarioNaoAutenticado
  {
    path: 'usuario',
    loadChildren: () => import('./usuario-nao-autenticado/usuario-routing.module').then((module) => module.UsuarioRoutingModule)
  },
  //administrador
  {
    path: 'administrador',
    loadChildren: () => import('./administrador/admin-routing.module').then((module) => module.AdministradorRoutingModule),
    canActivate: [authorizationService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
