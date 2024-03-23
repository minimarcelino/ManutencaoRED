import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoordenadorComponent } from './coordenador.component';
import { ListarREDsComponent } from './visualizacaoRed/listar/listar.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
//
import { CadastrarCursoComponent } from 'src/app/modulos/cursos/cadastrar/cadastrar.component';
import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar.component';
//
import { CadastrarDisciplinaComponent } from 'src/app/modulos/disciplinas/cadastrar/cadastrar.component';
import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/disciplinas.component';
//
import { PEEAbonadosComponent } from 'src/app/modulos/pee/abonados/pees-abonados.component';
import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';
import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar.component';
//
import { CadastrarServidoresComponent } from 'src/app/modulos/servidores/cadastrar/cadastrar.component';
import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar.component';

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
