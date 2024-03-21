import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoordenadorComponent } from './coordenador.component';
import { ListarDisciplinasComponent } from '../modulos/disciplinas/listar/disciplinas.component';
import { CadastrarDocenteComponent } from './docentes/cadastrar/cadastrar.component';
import { ListarDocenteComponent } from './docentes/listar/listar.component';
import { ListarRedComponent } from './visualizacaoRed/listar/listar.component';
import { ListarCursosComponent } from '../csp/cursos/listar/listar.component';
import { CadastrarCursoComponent } from '../csp/cursos/cadastrar/cadastrar.component';
import { PeeComponent } from './pee/pee.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { ListarPeesComponent } from '../professor/listar/listar.component';
import { CadastrarDisciplinaComponent } from '../modulos/disciplinas/cadastrar/cadastrar.component';

const routes: Routes = [
  {
    path: '',
    component: CoordenadorComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },

      // Rotas das Disciplinas
      {
        path: 'listarDisciplinas',
        component: ListarDisciplinasComponent,
      },
      {
        path: 'cadastrarDisciplina',
        component: CadastrarDisciplinaComponent,
      },

      // Rotas dos Curso
      {
        path: 'cadastrarCurso',
        component: CadastrarCursoComponent,
      },
      {
        path: 'listarCurso',
        component: ListarCursosComponent,
      },

      // Rotas dos RED
      {
        path: 'listarRed',
        component: ListarRedComponent,
      },

      // Rotas dos Servidores(Docentes)
      {
        path: 'cadastrar',
        component: CadastrarDocenteComponent,
      },
      {
        path: 'listarServidores',
        component: ListarDocenteComponent,
      },

      // Rotas dos PEE
      {
        path: 'listarPee',
        component: PeeComponent,
      },
      {
        path: 'listarMeusPees',
        component: ListarPeesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordenadorRoutingModule {}
