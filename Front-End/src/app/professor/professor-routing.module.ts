import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfessorComponent } from './professor.component';
import { PerfilComponent } from '../perfil/perfil.component';
//
import { ListarPEEComponent } from '../modulos/pee/listar/listar.component';
import { PEEAbonadosComponent } from '../modulos/pee/abonados/pees-abonados.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      //
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
export class ProfessorRoutingModule {}
