import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';
import { PerfilComponent } from '../perfil/perfil.component';
//
import { ListarAlunoComponent } from '../modulos/alunos/listar/listar.component';
import { CadastrarAlunoComponent } from '../modulos/alunos/cadastrar/cadastrar.component';
//
import { CadastrarProcessoREDComponent } from '../modulos/processo-red/cadastrar/processo-red.component';
import { ListarREDComponent } from '../modulos/processo-red/listar/listar.component';

const routes: Routes = [
  {
    path: '',
    component: CRAComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },

      // RED
      {
        path: 'cadastrarREDs',
        component: CadastrarProcessoREDComponent
      },
      {
        path: 'listarREDs',
        component: ListarREDComponent
      },

      // Aluno
      {
        path: 'listarAlunos',
        component: ListarAlunoComponent
      },
      {
        path: 'cadastrarAlunos',
        component: CadastrarAlunoComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule { }
