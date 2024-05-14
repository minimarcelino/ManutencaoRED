import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CSPComponent } from './csp.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar.component';
//
import { CadastrarCursoComponent } from 'src/app/modulos/cursos/cadastrar/cadastrar.component';
import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar.component';
//
import { CadastrarServidoresComponent } from 'src/app/modulos/servidores/cadastrar/cadastrar.component';
import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar.component';
//
import { CadastrarDisciplinaComponent } from 'src/app/modulos/disciplinas/cadastrar/cadastrar.component';
import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/disciplinas.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    component: CSPComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },

      {
        path: 'cadastrarCursos',
        component: CadastrarCursoComponent,
      },
      {
        path: 'cadastrarDisciplinas',
        component: CadastrarDisciplinaComponent,
      },
      {
        path:'listarDisciplinas',
        component:ListarDisciplinasComponent,
      },
      {
        path: 'listarServidores',
        component: ListarServidoresComponent,
      },
      {
        path: 'cadastrarServidores',
        component: CadastrarServidoresComponent,
      },
      {
        path: 'listarREDs',
        component: ListarREDComponent,
      },
      {
        path: 'visualizarREDCSP',
        component: CSPVisualizarREDComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CspRoutingModule {}
