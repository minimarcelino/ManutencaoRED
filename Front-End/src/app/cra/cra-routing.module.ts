import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';
import { ProcessoREDComponent } from './processo-red/processo-red.component';
import { ListarAlunoComponent } from './alunos/listar/listar.component';
import { CadastrarAlunoComponent } from './alunos/cadastrar/cadastrar.component';
import { ListarREDComponent } from './processo-red/listar/listar.component';
import { PerfilComponent } from '../perfil/perfil.component';

const routes: Routes = [
  {
    path: '', 
    component: CRAComponent,
    children: [
      {
        path: 'processo-red',
        component: ProcessoREDComponent
      },
      {
        path: 'listar',
        component: ListarAlunoComponent
      },
      {
        path: 'cadastrar',
        component: CadastrarAlunoComponent
      },
      {
        path: 'listarRED',
        component: ListarREDComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule { }