import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoordenadorComponent } from './coordenador.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { HomeCoordenadorComponent } from './home/home-coordenador.component';
//
import { FormularioCursoComponent } from 'src/app/modulos/cursos/formularioCurso/formulario-curso.component';
import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar-curso.component';
//
import { FormularioDisciplinaComponent } from 'src/app/modulos/disciplinas/formularioDisciplina/formulario-disciplina.component';
import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/listar-disciplina.component';
//
import { FormularioPEEComponent } from 'src/app/modulos/pee/formulario-PEE/formulario-pee.component';
import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';
import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar-pee.component';
//
import { FormularioServidoresComponent } from 'src/app/modulos/servidores/formularioServidor/formulario-servidor.component';
import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar-servidor.component';
//
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar-red.component';
import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';
import { FormularioREDComponent } from 'src/app/modulos/red/formulario-RED/formulario-red.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar-red-csp.component';

const routes: Routes = [
  {
    path: '',
    component: CoordenadorComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'home',
        component: HomeCoordenadorComponent,
      },

      // Rotas das Disciplinas
      {
        path: 'listarDisciplinas',
        component: ListarDisciplinasComponent,
      },
      {
        path: 'formularioDisciplina',
        component: FormularioDisciplinaComponent,
      },

      // Rotas dos Curso
      {
        path: 'formularioCurso',
        component: FormularioCursoComponent,
      },
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },

      // Rotas dos RED
      {
        path: 'visualizarREDCSP',
        component: CSPVisualizarREDComponent,
      },
      {
        path: 'formularioRED',
        component: FormularioREDComponent,
      },
      {
        path: 'listarREDs',
        component: ListarREDComponent,
      },
      {
        path: 'visualizarDisciplinasREDs',
        component: VisualizarDisciplinaComponent,
      },

      // Rotas dos Servidores(Docentes)
      {
        path: 'formularioServidor',
        component: FormularioServidoresComponent,
      },
      {
        path: 'listarServidores',
        component: ListarServidoresComponent,
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
        path: 'listarPEEs',
        component: ListarPEEComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordenadorRoutingModule {}
