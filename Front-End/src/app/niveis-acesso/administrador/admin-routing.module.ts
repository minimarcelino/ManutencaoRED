import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministradorComponent } from './administrador.component';

import { AssociarDisciplinaComponent } from 'src/app/modulos/associacoes/associar-disciplina/associar-disciplina.component';
import { PerfilComponent } from '../../perfil/perfil.component';
//
import { ListarDisciplinasComponent } from '../../modulos/disciplinas/listar/disciplinas.component';
import { CadastrarDisciplinaComponent } from '../../modulos/disciplinas/cadastrar/cadastrar.component';
//
import { ListarServidoresComponent } from '../../modulos/servidores/listar/listar.component';
import { CadastrarServidoresComponent } from '../../modulos/servidores/cadastrar/cadastrar.component';
//
import { ListarAlunoComponent } from '../../modulos/alunos/listar/listar.component';
import { CadastrarAlunoComponent } from '../../modulos/alunos/cadastrar/cadastrar.component';
//
import { FormularioREDComponent } from '../../modulos/red/formulario-RED/formulario-red.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar.component';
//
import { ListarCursosComponent } from '../../modulos/cursos/listar/listar.component';
import { CadastrarCursoComponent } from '../../modulos/cursos/cadastrar/cadastrar.component';

import { FormularioPEEComponent } from 'src/app/modulos/pee/formulario-PEE/formulario-pee.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar.component';
import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';

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
        path: 'cadastrarDisciplinas',
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
        path: 'formularioRED',
        component: FormularioREDComponent,
      },

      //Rotas dos Cursos
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },
      {
        path: 'cadastrarCursos',
        component: CadastrarCursoComponent,
      },

      //Rotas dos Alunos
      {
        path: 'listarAlunos',
        component: ListarAlunoComponent,
      },
      {
        path: 'cadastrarAlunos',
        component: CadastrarAlunoComponent,
      },
      // Rotas dos PEE
      {
        path:'formularioPEE',
        component:FormularioPEEComponent,
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
export class AdministradorRoutingModule {}
