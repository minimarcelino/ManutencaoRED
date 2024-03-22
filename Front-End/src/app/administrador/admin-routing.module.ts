import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministradorComponent } from './administrador.component';
import { ListarCursosComponent } from '../csp/cursos/listar/listar.component';
import { CadastrarCursoComponent } from '../csp/cursos/cadastrar/cadastrar.component';
import { AssociarDisciplinaComponent } from '../csp/associar-disciplina/associar-disciplina.component';
import { PerfilComponent } from '../perfil/perfil.component';
//
import { ListarDisciplinasComponent } from '../modulos/disciplinas/listar/disciplinas.component';
import { CadastrarDisciplinaComponent } from '../modulos/disciplinas/cadastrar/cadastrar.component';
//
import { ListarServidoresComponent } from '../modulos/servidores/listar/listar.component';
import { CadastrarServidoresComponent } from '../modulos/servidores/cadastrar/cadastrar.component';
//
import { ListarAlunoComponent } from '../modulos/alunos/listar/listar.component';
import { CadastrarAlunoComponent } from '../modulos/alunos/cadastrar/cadastrar.component';
import { CadastrarProcessoREDComponent } from '../modulos/processo-red/cadastrar/processo-red.component';
import { ListarREDComponent } from '../modulos/processo-red/listar/listar.component';

const routes: Routes = [
  {
    path: '',
    component: AdministradorComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },

      //Rotas das disciplinas
      {
        path: 'listarDisciplinas',
        component: ListarDisciplinasComponent,
      },
      {
        path: 'cadastrarDisciplina',
        component: CadastrarDisciplinaComponent,
      },
      {
        path: 'associarDisciplinas',
        component: AssociarDisciplinaComponent,
      },

      //Rotas dos Docentes
      {
        path: 'listarServidores',
        component: ListarServidoresComponent,
      },
      {
        path: 'cadastrarServidores',
        component: CadastrarServidoresComponent,
      },

      //Rotas dos REDs
      {
        path: 'listarREDs',
        component: ListarREDComponent,
      },
      {
        path: 'cadastrarREDs',
        component: CadastrarProcessoREDComponent,
      },

      //Rotas dos Cursos
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },
      {
        path: 'cadastrarCurso',
        component: CadastrarCursoComponent,
      },

      //Rotas dos Alunos
      {
        path: 'listarAlunos',
        component: ListarAlunoComponent,
      },
      {
        path: 'cadastrarAluno',
        component: CadastrarAlunoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
