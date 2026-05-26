import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CSPComponent } from './csp.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { HomeCSPComponent } from './home/home-csp.component';

// RED
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar-red.component';
import { FormularioREDComponent } from 'src/app/modulos/red/formulario-RED/formulario-red.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar-red-csp.component';

// CURSOS
import { FormularioCursoComponent } from 'src/app/modulos/cursos/formularioCurso/formulario-curso.component';
import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar-curso.component';

// SERVIDORES
import { FormularioServidoresComponent } from 'src/app/modulos/servidores/formularioServidor/formulario-servidor.component';
import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar-servidor.component';

// DISCIPLINAS
import { FormularioDisciplinaComponent } from 'src/app/modulos/disciplinas/formularioDisciplina/formulario-disciplina.component';
import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/listar-disciplina.component';

// 🔥 NOVOS (IMPORTANTE)
import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';
import { AssociarDisciplinaComponent } from 'src/app/modulos/associacoes/associar-disciplina/associar-disciplina.component';

const routes: Routes = [
  {
    path: '',
    component: CSPComponent,
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
        component: HomeCSPComponent,
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

      /* ================= DISCIPLINAS ================= */
      {
        path: 'listarDisciplinas',
        component: ListarDisciplinasComponent,
      },
      {
        path: 'formularioDisciplina',
        component: FormularioDisciplinaComponent,
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

      /* 🔥 NOVO PADRÃO (SEM MODAL) */
      {
        path: 'visualizar-disciplina',
        component: VisualizarDisciplinaComponent,
      },
      {
        path: 'associar-disciplina',
        component: AssociarDisciplinaComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CspRoutingModule {}