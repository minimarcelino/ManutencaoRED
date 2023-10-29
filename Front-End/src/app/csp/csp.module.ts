import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CSPComponent } from './csp.component';
import { CadastrarComponent } from './cursos/cadastrar/cadastrar.component';
import { ListarComponent } from './cursos/listar/listar.component';
import { EditarComponent } from './cursos/editar/editar.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DocenteComponent } from './docente/docente.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
    declarations: [
        CadastrarComponent,
        ListarComponent,
        EditarComponent,
        DocenteComponent
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
      MatMomentDateModule
    ],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    ]
  })
  export class CspModule { }