import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorComponent } from './professor.component';
import { ListarPeesComponent } from './listar/listar.component';

const routes: Routes = [
    {
      path: '', 
      component: ProfessorComponent,
      children: [
        {
            path: 'listarPees',
            component: ListarPeesComponent,
        }
      ]
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ProfessorRoutingModule { }