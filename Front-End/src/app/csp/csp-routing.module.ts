import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSPComponent } from './csp.component';
import { ListarCursosComponent } from './cursos/listar/listar.component';
import { CadastrarCursoComponent } from './cursos/cadastrar/cadastrar.component';

import { ListarRedComponent } from './processo-red/listar/listar.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { ListarServidoresComponent } from '../modulos/servidores/listar/listar.component';
import { CadastrarServidoresComponent } from '../modulos/servidores/cadastrar/cadastrar.component';

const routes: Routes = [
  {
    path: '',
    component: CSPComponent,
    children: [
        {
            path: 'listarCursos',
            component: ListarCursosComponent
        },
        {
            path: 'cadastrarCursos',
            component:  CadastrarCursoComponent,
        },
        {
          path: 'listarServidores',
          component: ListarServidoresComponent,
        },
        {
          path: 'cadastrarServidores',
          component: CadastrarServidoresComponent,
        },
        {
          path: 'listarRed',
          component: ListarRedComponent,
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
export class CspRoutingModule { }
