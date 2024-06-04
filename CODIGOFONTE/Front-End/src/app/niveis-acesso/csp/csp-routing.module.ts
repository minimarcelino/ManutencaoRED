import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CSPComponent } from './csp.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { HomeComponent } from './home/home.component';
//
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar.component';
import { FormularioREDComponent } from 'src/app/modulos/red/formulario-RED/formulario-red.component';
//
import { FormularioCursoComponent } from 'src/app/modulos/cursos/formularioCurso/formulario-curso.component';
import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar.component';
//
import { FormularioServidoresComponent } from 'src/app/modulos/servidores/formularioServidor/formulario-servidor.component';
import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar.component';
//
import { FormularioDisciplinaComponent } from 'src/app/modulos/disciplinas/formularioDisciplina/formulario-disciplina.component';
import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/disciplinas.component';
import { CSPVisualizarREDComponent } from 'src/app/modulos/red/visualizar-csp/visualizar.component';

const routes: Routes = [
  {
    path: '',
    component: CSPComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      // Cursos
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },
      {
        path: 'formularioCurso',
        component: FormularioCursoComponent,
      },
      // Disciplinas
      {
        path: 'formularioDisciplina',
        component: FormularioDisciplinaComponent,
      },
      {
        path:'listarDisciplinas',
        component:ListarDisciplinasComponent,
      },
      // Servidores
      {
        path: 'listarServidores',
        component: ListarServidoresComponent,
      },
      {
        path: 'formularioServidor',
        component: FormularioServidoresComponent,
      },
      // REDs
      {
        path: 'formularioRED',
        component: FormularioREDComponent,
      },
      {
        path: 'listarREDs',
        component: ListarREDComponent,
      },
      {
        path: 'visualizarREDCSP',
        component: CSPVisualizarREDComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CspRoutingModule {}
