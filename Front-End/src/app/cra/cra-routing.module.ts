import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';
import { ProcessoREDComponent } from './processo-red/processo-red.component';
import { ListarComponent } from './alunos/listar/listar.component';
import { CadastrarComponent } from './alunos/cadastrar/cadastrar.component';
import { ListarREDComponent } from './processo-red/listar/listar.component';

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
        component: ListarComponent
      },
      {
        path: 'cadastrar',
        component: CadastrarComponent
      },
      {
        path: 'listarRED',
        component: ListarREDComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule { }