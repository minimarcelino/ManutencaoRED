import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar.component';
import { listarCursoRoutingModule } from './listarCurso-routing.module';


@NgModule({
    declarations: [
        ListarComponent
    ],
    imports: [
      CommonModule,
      listarCursoRoutingModule
    ]
  })
  export class listarCursoModule { }