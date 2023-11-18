import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoordenadorComponent } from "./coordenador.component";
import { DisciplinasComponent } from "../coordenador/disciplinas/disciplinas.component";
import { CadastrarDocenteComponent } from "./docentes/cadastrar/cadastrar.component";
import { ListarDocenteComponent } from "./docentes/listar/listar.component";
import { ListarRedComponent } from "./visualizacaoRed/listar/listar.component";
import { CadastrarDisciplinaComponent } from "./disciplinas/cadastrar/cadastrar.component";
import { ListarCursosComponent } from "../csp/cursos/listar/listar.component";
import { CadastrarCursoComponent } from "../csp/cursos/cadastrar/cadastrar.component";
import { PeeComponent } from "./pee/pee.component";

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
                path: 'listarCurso', 
                component: ListarCursosComponent
            },
            {
                path: 'cadastrarCurso', 
                component:  CadastrarCursoComponent,
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
            {
                path: 'listarPee',
                component: PeeComponent
            },
        ]

    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoordenadorRoutingModule { }