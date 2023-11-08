import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CSPComponent } from './csp.component';
import {  CadastrarCursoComponent } from './cursos/cadastrar/cadastrar.component';
import { ListarCursosComponent } from './cursos/listar/listar.component';
import { EditarComponent } from './cursos/editar/editar.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DocenteComponent } from './docente/docente.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditarDocenteComponent  } from './docente/editar/editar.component';
import { CadastrarDocenteComponent } from './docente/cadastrar/cadastrar.component';
import { ListarRedComponent } from './processo-red/listar/listar.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    declarations: [
        CadastrarCursoComponent,
        ListarCursosComponent,
        EditarComponent,
        DocenteComponent,
        CadastrarDocenteComponent,
        EditarDocenteComponent,
        ListarRedComponent
  ],
    imports: [
      CommonModule,
      MatIconModule,
      ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatSnackBarModule,
      MatTableModule,
      MatMomentDateModule,
      MatPaginatorModule,
      NgxMaskPipe,
      NgxMaskDirective,
    ],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      provideNgxMask()
    ]
  })
  export class CspModule { }