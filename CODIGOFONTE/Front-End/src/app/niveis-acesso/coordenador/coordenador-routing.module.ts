import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoordenadorComponent } from './coordenador.component';

import { PerfilComponent } from 'src/app/perfil/perfil.component';

import { HomeCoordenadorComponent } from './home/home-coordenador.component';

/* ================= CURSOS ================= */

import { FormularioCursoComponent } from 'src/app/modulos/cursos/formularioCurso/formulario-curso.component';

import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar-curso.component';

/* ================= DISCIPLINAS ================= */

import { FormularioDisciplinaComponent } from 'src/app/modulos/disciplinas/formularioDisciplina/formulario-disciplina.component';

import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/listar-disciplina.component';

/* ================= PEE ================= */

import { FormularioPEEComponent } from 'src/app/modulos/pee/formulario-PEE/formulario-pee.component';

import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';

import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar-pee.component';

/* ================= SERVIDORES ================= */

import { FormularioServidoresComponent } from 'src/app/modulos/servidores/formularioServidor/formulario-servidor.component';

import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar-servidor.component';

/* ================= RED ================= */

import { ListarREDComponent } from 'src/app/modulos/red/listar/listar-red.component';

import { FormularioREDComponent } from 'src/app/modulos/red/formulario-RED/formulario-red.component';

import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar-red-csp.component';

import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';

/* ================= ASSOCIAÇÃO ================= */

import { AssociarDisciplinaComponent } from 'src/app/modulos/associacoes/associar-disciplina/associar-disciplina.component';

const routes: Routes = [

  {
    path: '',

    component: CoordenadorComponent,

    children: [

      /* ================= REDIRECT PADRÃO ================= */

      {
        path: '',

        redirectTo: 'home',

        pathMatch: 'full'
      },

      /* ================= GERAL ================= */

      {
        path: 'perfil',

        component: PerfilComponent,
      },

      {
        path: 'home',

        component: HomeCoordenadorComponent,
      },

      /* ================= DISCIPLINAS ================= */

      {
        path: 'listarDisciplinas',

        component: ListarDisciplinasComponent,
      },

      {
        path: 'formularioDisciplina',

        component: FormularioDisciplinaComponent,
      },

      /* ================= CURSOS ================= */

      {
        path: 'listarCursos',

        component: ListarCursosComponent,
      },

      {
        path: 'formularioCurso',

        component: FormularioCursoComponent,
      },

      /* ================= RED ================= */

      {
        path: 'listarREDs',

        component: ListarREDComponent,
      },

      {
        path: 'formularioRED',

        component: FormularioREDComponent,
      },

      {
        path: 'visualizarREDCSP',

        component: CSPVisualizarREDComponent,
      },

      /* ================= VISUALIZAR DISCIPLINA ================= */

      // 🔥 COM ID

      {
        path: 'visualizar-disciplina/:id',

        component: VisualizarDisciplinaComponent,
      },

      // 🔥 COMPATIBILIDADE ANTIGA

      {
        path: 'visualizarDisciplinasREDs',

        component: VisualizarDisciplinaComponent,
      },

      /* ================= ASSOCIAR DISCIPLINA ================= */

      // 🔥 COM ID

      {
        path: 'associar-disciplina/:id',

        component: AssociarDisciplinaComponent,
      },

      // 🔥 COMPATIBILIDADE ANTIGA

      {
        path: 'associar-disciplina',

        component: AssociarDisciplinaComponent,
      },

      /* ================= SERVIDORES ================= */

      {
        path: 'listarServidores',

        component: ListarServidoresComponent,
      },

      {
        path: 'formularioServidor',

        component: FormularioServidoresComponent,
      },

      /* ================= PEE ================= */

      {
        path: 'listarPEEs',

        component: ListarPEEComponent,
      },

      {
        path: 'gerenciarPEEs',

        component: GerenciarPEEComponent,
      },

      {
        path: 'formularioPEE',

        component: FormularioPEEComponent,
      },

    ],
  },

];

@NgModule({

  imports: [
    RouterModule.forChild(routes)
  ],

  exports: [
    RouterModule
  ],

})

export class CoordenadorRoutingModule {}