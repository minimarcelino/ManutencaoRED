import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioNaoAutenticadoComponent } from './usuario-nao-autenticado.component';

const routes: Routes = [
    {
      path: ':id', 
      component: UsuarioNaoAutenticadoComponent
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UsuarioRoutingModule { }
