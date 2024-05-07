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
import { MatSelectModule } from '@angular/material/select';

import { AssociarDisciplinaComponent } from './associar-disciplina/associar-disciplina.component';
import { VisualizarRedComponent } from './processo-red/visualizar/visualizar.component';
//
import { CadastrarCursoComponent } from 'src/app/modulos/cursos/cadastrar/cadastrar.component';
import { EditarCursoComponent } from 'src/app/modulos/cursos/editar/editar.component';
import { ListarCursosComponent } from 'src/app/modulos/cursos/listar/listar.component';
//
import { CadastrarServidoresComponent } from 'src/app/modulos/servidores/cadastrar/cadastrar.component';
import { EditarServidoresComponent } from 'src/app/modulos/servidores/editar/editar.component';
import { ListarServidoresComponent } from 'src/app/modulos/servidores/listar/listar.component';

@NgModule({
  declarations: [
    CadastrarServidoresComponent,
    ListarServidoresComponent,
    EditarServidoresComponent,
    //
    CadastrarCursoComponent,
    ListarCursosComponent,
    EditarCursoComponent,
    //
    VisualizarRedComponent,
    AssociarDisciplinaComponent,
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
