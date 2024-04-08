import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
//
import { CadastrarAlunoComponent } from 'src/app/modulos/alunos/cadastrar/cadastrar.component';
import { ListarAlunoComponent } from 'src/app/modulos/alunos/listar/listar.component';
//
import { CadastrarProcessoREDComponent } from 'src/app/modulos/red/cadastrar/processo-red.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar.component';

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
