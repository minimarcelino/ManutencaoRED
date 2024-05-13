import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioNaoAutenticadoComponent } from './usuario-nao-autenticado.component';
import { TrocarSenhaComponent } from '../modulos/servidores/trocar-senha/trocar-senha.component';

const routes: Routes = [
    { path: 'trocar-senha/:token',
    component: TrocarSenhaComponent 
    }, 
    {
      path: ':hash', 
      component: UsuarioNaoAutenticadoComponent
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UsuarioRoutingModule { }
