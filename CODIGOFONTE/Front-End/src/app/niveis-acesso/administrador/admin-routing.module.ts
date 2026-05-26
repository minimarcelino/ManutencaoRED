import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministradorComponent } from './administrador.component';

import { AssociarDisciplinaComponent } from 'src/app/modulos/associacoes/associar-disciplina/associar-disciplina.component';
import { PerfilComponent } from '../../perfil/perfil.component';
import { HomeAdministradorComponent } from './home/home-administrador.component';
//
import { ListarDisciplinasComponent } from '../../modulos/disciplinas/listar/listar-disciplina.component';
import { FormularioDisciplinaComponent } from '../../modulos/disciplinas/formularioDisciplina/formulario-disciplina.component';
//
import { ListarServidoresComponent } from '../../modulos/servidores/listar/listar-servidor.component';
import { FormularioServidoresComponent } from '../../modulos/servidores/formularioServidor/formulario-servidor.component';
//
import { ListarAlunoComponent } from '../../modulos/alunos/listar/listar-aluno.component';
import { FormularioAlunoComponent } from '../../modulos/alunos/formularioAluno/formulario-aluno.component';
//
import { FormularioREDComponent } from '../../modulos/red/formulario-RED/formulario-red.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar-red.component';
//
import { ListarCursosComponent } from '../../modulos/cursos/listar/listar-curso.component';
import { FormularioCursoComponent } from '../../modulos/cursos/formularioCurso/formulario-curso.component';

import { FormularioPEEComponent } from 'src/app/modulos/pee/formulario-PEE/formulario-pee.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar-red-csp.component';
import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';

const routes: Routes = [
  {
    path: '',
    component: AdministradorComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'home',
        component: HomeAdministradorComponent,
      },

      //Rotas das disciplinas
      {
        path: 'listarDisciplinas',
        component: ListarDisciplinasComponent,
      },
      {
        path: 'formularioDisciplina',
        component: FormularioDisciplinaComponent,
      },
      {
        path: 'associar-disciplinas',
        component: AssociarDisciplinaComponent,
      },
      {
        path: 'visualizar-disciplina',
        component: CSPVisualizarREDComponent,
      },

      //Rotas dos Docentes
      {
        path: 'listarServidores',
        component: ListarServidoresComponent,
      },
      {
        path: 'formularioServidor',
        component: FormularioServidoresComponent,
      },

      //Rotas dos REDs
      {
        path: 'listarREDs',
        component: ListarREDComponent,
      },
      {
        path: 'formularioRED',
        component: FormularioREDComponent,
      },

      //Rotas dos Cursos
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },
      {
        path: 'formularioCurso',
        component: FormularioCursoComponent,
      },

      //Rotas dos Alunos
      {
        path: 'listarAlunos',
        component: ListarAlunoComponent,
      },
      {
        path: 'formularioAluno',
        component: FormularioAlunoComponent,
      },
      // Rotas dos PEE
      {
        path: 'formularioPEE',
        component: FormularioPEEComponent,
      },
      {
        path: 'gerenciarPEEs',
        component: GerenciarPEEComponent,
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
export class AdministradorRoutingModule { }
