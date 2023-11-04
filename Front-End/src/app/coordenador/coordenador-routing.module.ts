import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoordenadorComponent } from "./coordenador.component";
import { DisciplinasComponent } from "../coordenador/disciplinas/disciplinas.component";
import { CadastrarDocenteComponent } from "./docentes/cadastrar/cadastrar.component";
import { ListarDocenteComponent } from "./docentes/listar/listar.component";

const routes: Routes = [
    {
        path: '',
        component: CoordenadorComponent,
        children: [
            {
                path: 'disciplinas',
                component: DisciplinasComponent
            },
            {
                path: 'cadastrar',
                component: CadastrarDocenteComponent
            },
            {
                path: 'listar',
                component: ListarDocenteComponent
            },
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoordenadorRoutingModule { }