import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { HomeCRAComponent } from './home/home-cra.component';
//
import { FormularioAlunoComponent } from 'src/app/modulos/alunos/formularioAluno/formulario-aluno.component';
import { ListarAlunoComponent } from 'src/app/modulos/alunos/listar/listar-aluno.component';
//
import { FormularioREDComponent } from 'src/app/modulos/red/formulario-RED/formulario-red.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar-red.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar-red-csp.component';

const routes: Routes = [
  {
    path: '',
    component: CRAComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },

      {
        path: 'home',
        component: HomeCRAComponent,
      },

      // RED
      {
        path: 'formularioRED',
        component: FormularioREDComponent
      },
      {
        path: 'listarREDs',
        component: ListarREDComponent
      },
      {
        path: 'visualizarREDCSP',
        component:CSPVisualizarREDComponent
      },

      // Aluno
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
export class CraRoutingModule { }
