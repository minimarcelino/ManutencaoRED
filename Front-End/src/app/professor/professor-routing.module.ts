import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorComponent } from './professor.component';
import { ListarPeesComponent } from './listar/listar.component';
import { PeesAbonadosComponent } from './pees-abonados/pees-abonados.component';
import { PerfilComponent } from '../perfil/perfil.component';

const routes: Routes = [
    {
      path: '', 
      component: ProfessorComponent,
      children: [
        {
            path: 'listarPees',
            component: ListarPeesComponent,
        },
        {
          path: 'listarPeesAbonados',
          component: PeesAbonadosComponent,
        },
        {
          path: 'perfil',
          component: PerfilComponent,
        },
      ]
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProfessorRoutingModule { }