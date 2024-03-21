import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministradorComponent } from './administrador.component';
import { ListarDisciplinasComponent } from '../modulos/disciplinas/listar/disciplinas.component';
import { ListarRedComponent } from '../csp/processo-red/listar/listar.component';
import { ListarCursosComponent } from '../csp/cursos/listar/listar.component';
import { ListarAlunoComponent } from '../cra/alunos/listar/listar.component';
import { CadastrarDisciplinaComponent } from '../modulos/disciplinas/cadastrar/cadastrar.component';
import { CadastrarDocenteComponent } from '../csp/docente/cadastrar/cadastrar.component';
import { ProcessoREDComponent } from '../cra/processo-red/processo-red.component';
import { CadastrarCursoComponent } from '../csp/cursos/cadastrar/cadastrar.component';
import { CadastrarAlunoComponent } from '../cra/alunos/cadastrar/cadastrar.component';
import { DocenteComponent } from '../csp/docente/docente.component';
import { AssociarDisciplinaComponent } from '../csp/associar-disciplina/associar-disciplina.component';
import { PerfilComponent } from '../perfil/perfil.component';

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
        component: DocenteComponent,
      },
      {
        path: 'cadastrarDocente',
        component: CadastrarDocenteComponent,
      },

      //Rotas dos REDs
      {
        path: 'listarReds',
        component: ListarRedComponent,
      },
      {
        path: 'cadastrarRed',
        component: ProcessoREDComponent,
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
