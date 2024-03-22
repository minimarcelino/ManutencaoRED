import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoordenadorComponent } from './coordenador.component';
import { ListarREDsComponent } from './visualizacaoRed/listar/listar.component';
import { PerfilComponent } from '../perfil/perfil.component';
//
import { CadastrarDisciplinaComponent } from '../modulos/disciplinas/cadastrar/cadastrar.component';
import { ListarDisciplinasComponent } from '../modulos/disciplinas/listar/disciplinas.component';
//
import { CadastrarServidoresComponent } from '../modulos/servidores/cadastrar/cadastrar.component';
import { ListarServidoresComponent } from '../modulos/servidores/listar/listar.component';
//
import { CadastrarCursoComponent } from '../modulos/cursos/cadastrar/cadastrar.component';
import { ListarCursosComponent } from '../modulos/cursos/listar/listar.component';
//
import { GerenciarPEEComponent } from '../modulos/pee/gerenciar/gerenciar-pee.component';
import { ListarPEEComponent } from '../modulos/pee/listar/listar.component';
import { PEEAbonadosComponent } from '../modulos/pee/abonados/pees-abonados.component';

const routes: Routes = [
  {
    path: '',
    component: CoordenadorComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },

      // Rotas das Disciplinas
      {
        path: 'listarDisciplinas',
        component: ListarDisciplinasComponent,
      },
      {
        path: 'cadastrarDisciplina',
        component: CadastrarDisciplinaComponent,
      },

      // Rotas dos Curso
      {
        path: 'cadastrarCursos',
        component: CadastrarCursoComponent,
      },
      {
        path: 'listarCursos',
        component: ListarCursosComponent,
      },

      // Rotas dos RED
      {
        path: 'listarREDs',
        component: ListarREDsComponent,
      },

      // Rotas dos Servidores(Docentes)
      {
        path: 'cadastrarServidores',
        component: CadastrarServidoresComponent,
      },
      {
        path: 'listarServidores',
        component: ListarServidoresComponent,
      },

      // Rotas dos PEE
      {
        path: 'gerenciarPEEs',
        component: GerenciarPEEComponent,
      },
      {
        path: 'listarPEEs',
        component: ListarPEEComponent,
      },
      {
        path: 'PEEsAbonados',
        component: PEEAbonadosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordenadorRoutingModule {}
