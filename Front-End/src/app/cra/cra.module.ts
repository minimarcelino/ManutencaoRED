import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CRAComponent } from './cra.component';
import { ProcessoREDComponent } from './processo-red/processo-red.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CadastrarComponent } from './alunos/cadastrar/cadastrar.component';
import { ListarComponent } from './alunos/listar/listar.component';
import { EditarComponent } from './alunos/editar/editar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListarREDComponent } from './processo-red/listar/listar.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
  
@NgModule({
    declarations: [
    CadastrarComponent,
    ListarComponent,
    ProcessoREDComponent,
    EditarComponent,
    ListarREDComponent
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
      MatNativeDateModule,
      MatDatepickerModule,
      MatPaginatorModule,
      MatMomentDateModule,
      NgxMaskDirective,
      NgxMaskPipe
    ],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      provideNgxMask()
    ]
  })
  export class CraModule { }