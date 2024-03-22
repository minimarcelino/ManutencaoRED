import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CadastrarCursoComponent } from './cursos/cadastrar/cadastrar.component';
import { ListarCursosComponent } from './cursos/listar/listar.component';
import { EditarComponent } from './cursos/editar/editar.component';
import { ListarRedComponent } from './processo-red/listar/listar.component';
import { AssociarDisciplinaComponent } from './associar-disciplina/associar-disciplina.component';
import { VisualizarRedComponent } from './processo-red/visualizar/visualizar.component';
//
import { CadastrarServidoresComponent } from '../modulos/servidores/cadastrar/cadastrar.component';
import { ListarServidoresComponent } from '../modulos/servidores/listar/listar.component';
import { EditarServidoresComponent } from '../modulos/servidores/editar/editar.component';

@NgModule({
  declarations: [
    CadastrarServidoresComponent,
    ListarServidoresComponent,
    EditarServidoresComponent,
    //
    CadastrarCursoComponent,
    ListarCursosComponent,
    EditarComponent,
    ListarRedComponent,
    AssociarDisciplinaComponent,
    VisualizarRedComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatMomentDateModule,
    MatPaginatorModule,
    NgxMaskPipe,
    NgxMaskDirective,
    MatCheckboxModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    provideNgxMask(),
  ],
})
export class CspModule {}
