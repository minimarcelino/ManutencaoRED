import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarCursosComponent } from './listar.component';


const routes: Routes = [
    {
        path: 'csp/listar', component: ListarCursosComponent
    }
];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class listarCursoRoutingModule { }