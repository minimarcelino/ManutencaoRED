import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListarCursosComponent } from './listar.component';
import { listarCursoRoutingModule } from './listarCurso-routing.module';
import { MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    declarations: [
        ListarCursosComponent
    ],
    imports: [
      CommonModule,
      listarCursoRoutingModule,
      MatButtonModule,
      MatTableModule,
      MatIconModule
    ]
  })
  export class listarCursoModule { }