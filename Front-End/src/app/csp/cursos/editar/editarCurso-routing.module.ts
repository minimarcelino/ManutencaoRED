import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarCursoComponent } from './editar.component';

const routes: Routes = [
    {
        path: '', component: EditarCursoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class editarCursoRoutingModule { }
