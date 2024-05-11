import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfessorComponent } from './professor.component';
import { PEEAbonadosComponent } from 'src/app/modulos/pee/abonados/pees-abonados.component';
import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar.component';
import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { FormularioPEEComponent } from 'src/app/modulos/pee/formulario-PEE/formulario-pee.component';

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
        path:'formularioPEE',
        component: FormularioPEEComponent,
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
export class ProfessorRoutingModule {}
