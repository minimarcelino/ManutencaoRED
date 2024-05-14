import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PerfilComponent } from 'src/app/perfil/perfil.component';
import { HomeComponent } from './home/home.component';
//
import { ProfessorComponent } from './professor.component';
import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar.component';
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
        path: 'home',
        component: HomeComponent,
      },
      {
        path:'formularioPEE',
        component: FormularioPEEComponent,
      },
      {
        path: 'listarPEEs',
        component: ListarPEEComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessorRoutingModule {}
