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
    path: 'curso', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('../app/cursos/listar/listarCurso.module').then((module) => module.listarCursoModule),
  },
  {
    path: 'curso/cadastrar', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('../app/cursos/cadastrar/cadastrarCurso-routing.module').then((module) => module.cadastrarCursoRoutingModule),
  },
  //aluno
  {
    path: 'aluno', 
    //lazyLoading - carregar mais rapido
    loadChildren: () =>import('../app/alunos/aluno.module').then((module) => module.AlunoModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
