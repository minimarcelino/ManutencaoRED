import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoordenadorComponent } from "./coordenador.component";
import { DisciplinasComponent } from "../coordenador/disciplinas/disciplinas.component";

const routes: Routes = [
    {
        path: '',
        component: CoordenadorComponent,
        children: [
            {
                path: 'disciplinas',
                component: DisciplinasComponent
            },

        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoordenadorRoutingModule { }