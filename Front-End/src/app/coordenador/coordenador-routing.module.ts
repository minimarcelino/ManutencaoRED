import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoordenadorComponent } from "./coordenador.component";
import { DisciplinasComponent } from "../coordenador/disciplinas/disciplinas.component";
import { CadastrarDocenteComponent } from "./docentes/cadastrar/cadastrar.component";
import { ListarDocenteComponent } from "./docentes/listar/listar.component";
import { ListarRedComponent } from "./visualizacaoRed/listar/listar.component";
import { CadastrarDisciplinaComponent } from "./disciplinas/cadastrar/cadastrar.component";

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
            {
                path: 'listarRed',
                component: ListarRedComponent
            },
            {
                path: 'cadastrarDisciplina',
                component: CadastrarDisciplinaComponent
            },
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoordenadorRoutingModule { }