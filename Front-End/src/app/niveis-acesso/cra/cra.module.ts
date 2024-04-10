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
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { CadastrarAlunoComponent } from 'src/app/modulos/alunos/cadastrar/cadastrar.component';
import { EditarAlunosComponent } from 'src/app/modulos/alunos/editar/editar.component';
import { ListarAlunoComponent } from 'src/app/modulos/alunos/listar/listar.component';
import { VisualizarAlunoComponent } from 'src/app/modulos/alunos/visualizar/visualizar.component';
//
import { CadastrarProcessoREDComponent } from 'src/app/modulos/red/cadastrar/processo-red.component';
import { EditarREDComponent } from 'src/app/modulos/red/editar/editar.component';
import { ListarREDComponent } from 'src/app/modulos/red/listar/listar.component';
import { VisualizarREDComponent } from 'src/app/modulos/red/visualizar/visualizar.component';

@NgModule({
  declarations: [
    CadastrarAlunoComponent,
    ListarAlunoComponent,
    EditarAlunosComponent,
    VisualizarAlunoComponent,
    //
    ListarREDComponent,
    EditarREDComponent,
    VisualizarREDComponent,
    CadastrarProcessoREDComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    // MatSelectChange,
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatMomentDateModule,
    NgxMaskDirective,
    NgxMaskPipe,

  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    provideNgxMask(),
  ],
})
export class CraModule {}
