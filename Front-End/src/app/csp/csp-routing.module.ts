import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSPComponent } from './csp.component';
import { ListarComponent } from './cursos/listar/listar.component';
import { CadastrarComponent } from './cursos/cadastrar/cadastrar.component';

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
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CspRoutingModule { }