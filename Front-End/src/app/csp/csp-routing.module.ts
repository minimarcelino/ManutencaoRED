import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSPComponent } from './csp.component';
import { ListarComponent } from './cursos/listar/listar.component';
import { CadastrarComponent } from './cursos/cadastrar/cadastrar.component';
import { DocenteComponent } from './docente/docente.component';
import { CadastrarDocenteComponent } from './docente/cadastrar/cadastrar.component';
import { ListarRedComponent } from './processo-red/listar/listar.component';

const routes: Routes = [
  {
    path: '', 
    component: CSPComponent,
    children: [
        {
            path: 'listar', 
            component: ListarComponent
        },
        {
            path: 'cadastrar', 
            component: CadastrarComponent,
        },
        {
          path: 'docentes',
          component: DocenteComponent,
        },
        {
          path: 'cadastrarDocentes',
          component: CadastrarDocenteComponent,
        },
        {
          path: 'listarRed',
          component: ListarRedComponent,
        },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CspRoutingModule { }