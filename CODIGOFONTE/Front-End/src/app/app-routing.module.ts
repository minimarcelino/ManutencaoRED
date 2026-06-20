import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { VisualizarDisciplinasComponent } from './visualizar-disciplinas/visualizar-disciplinas.component';
import { ListarDisciplinasComponent } from './modulos/disciplinas/listar/listar-disciplina.component';
import { ManualComponent } from './pages/manual/manual.component';
import { authorizationService } from '../app/services/authorization.service';
import { HomeComponent } from './home/home.component';
import { AnaliseRedsComponent } from './pages/analise-reds/analise-reds.component';
import { ListarPEEComponent } from './modulos/pee/listar/listar-pee.component';
import { DetalhesRedComponent } from './pages/detalhes-red/detalhes-red.component';

const routes: Routes = [

  // REDIRECIONAMENTO INICIAL
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // LOGIN
  {
    path: 'login',
    component: LoginComponent
  },

  // MANUAL DO SISTEMA
  {
    path: 'manual',
    component: ManualComponent
  },

  // VISUALIZAR DISCIPLINAS
  {
    path: 'visualizar-disciplinas/:id',
    component: VisualizarDisciplinasComponent
  },
  {
    path: 'reds/analise',
    component: AnaliseRedsComponent
  },
  {
    path: 'detalhes-red/:id',
    component: DetalhesRedComponent
  },
  {
    path: 'listarDisciplinas',
    component: ListarDisciplinasComponent
  },
  // CSP
  {
    path: 'csp',
    loadChildren: () =>
      import('./niveis-acesso/csp/csp-routing.module')
        .then((module) => module.CspRoutingModule),

    canActivate: [authorizationService]
  },

  // CRA
  {
    path: 'cra',
    loadChildren: () =>
      import('./niveis-acesso/cra/cra-routing.module')
        .then((module) => module.CraRoutingModule),

    canActivate: [authorizationService]
  },

  // COORDENADOR
  {
    path: 'coordenador',
    loadChildren: () =>
      import('./niveis-acesso/coordenador/coordenador-routing.module')
        .then((module) => module.CoordenadorRoutingModule),

    canActivate: [authorizationService]
  },

  // PROFESSOR
  {
    path: 'professor',
    loadChildren: () =>
      import('./niveis-acesso/professor/professor-routing.module')
        .then((module) => module.ProfessorRoutingModule),

    canActivate: [authorizationService]
  },

  // USUÁRIO NÃO AUTENTICADO
  {
    path: 'usuario',
    loadChildren: () =>
      import('./usuario-nao-autenticado/usuario-routing.module')
        .then((module) => module.UsuarioRoutingModule)
  },

  // ADMINISTRADOR
  {
    path: 'administrador',
    loadChildren: () =>
      import('./niveis-acesso/administrador/admin-routing.module')
        .then((module) => module.AdministradorRoutingModule),

    canActivate: [authorizationService]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }