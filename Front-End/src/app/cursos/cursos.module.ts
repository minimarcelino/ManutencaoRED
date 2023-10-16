import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosRoutingModule } from './cursos-routing.module';
import { CursosComponent } from './cursos.component';
import { ListarComponent } from './listar/listar.component';


@NgModule({
    declarations: [
      CursosComponent,
      ListarComponent
    ],
    imports: [
      CommonModule,
      CursosRoutingModule
    ]
  })
  export class CursosModule { }