import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CRAComponent } from './cra.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { HomeCRAComponent } from './home/home-cra.component';

// ALUNO
import { FormularioAlunoComponent } from 'src/app/modulos/alunos/formularioAluno/formulario-aluno.component';
import { ListarAlunoComponent } from 'src/app/modulos/alunos/listar/listar-aluno.component';

// RED
import { FormularioREDComponent } from 'src/app/modulos/red/formulario-RED/formulario-red.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar-red.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar-red-csp.component';

// 🔥 NOVOS COMPONENTES (IMPORTANTE)
import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';
import { AssociarDisciplinaComponent } from 'src/app/modulos/associacoes/associar-disciplina/associar-disciplina.component';

const routes: Routes = [
  {
    path: '',
    component: CRAComponent,
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
        component: HomeCRAComponent,
      },

      /* ================= RED ================= */

      {
        path: 'listarREDs',
        component: ListarREDComponent
      },
      {
        path: 'formularioRED',
        component: FormularioREDComponent
      },
      {
        path: 'visualizarREDCSP',
        component: CSPVisualizarREDComponent
      },

      /* 🔥 NOVAS ROTAS (ESSENCIAL) */
      {
        path: 'visualizar-disciplina',
        component: VisualizarDisciplinaComponent
      },
      {
        path: 'associar-disciplina',
        component: AssociarDisciplinaComponent
      },

      /* ================= ALUNO ================= */

      {
        path: 'listarAlunos',
        component: ListarAlunoComponent
      },
      {
        path: 'formularioAluno',
        component: FormularioAlunoComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule {}