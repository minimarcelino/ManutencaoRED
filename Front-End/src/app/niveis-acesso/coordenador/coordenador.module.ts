import { NgModule } from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//
import { CadastrarDisciplinaComponent } from 'src/app/modulos/disciplinas/cadastrar/cadastrar.component';
import { EditarDisciplinaComponent } from 'src/app/modulos/disciplinas/editar/editar.component';
import { ListarDisciplinasComponent } from 'src/app/modulos/disciplinas/listar/disciplinas.component';
import { VisualizarDisciplinaComponent } from 'src/app/modulos/red/visualizar-disciplina/visualizar-disciplina.component';

@NgModule({
  declarations: [
    VisualizarDisciplinaComponent,
    //
    ListarDisciplinasComponent,
    CadastrarDisciplinaComponent,
    EditarDisciplinaComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    // MatSelectChange,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatMomentDateModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatPaginatorModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    provideNgxMask(),
  ],
})
export class CoordenadorModule {}
