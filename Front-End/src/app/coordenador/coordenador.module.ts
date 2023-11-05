import { NgModule } from '@angular/core';
import { DisciplinasComponent } from '../coordenador/disciplinas/disciplinas.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CadastrarDocenteComponent } from './docentes/cadastrar/cadastrar.component';
import { ListarDocenteComponent } from './docentes/listar/listar.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditarDocenteComponent  } from './docentes/editar/editar.component';
import { ListarRedComponent } from './visualizacaoRed/listar/listar.component';
import { CadastrarDisciplinaComponent } from './disciplinas/cadastrar/cadastrar.component';
@NgModule({
    declarations: [
        DisciplinasComponent,
        CadastrarDocenteComponent,
        ListarDocenteComponent,
        EditarDocenteComponent,
        ListarRedComponent,
        CadastrarDisciplinaComponent,
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
        NgxMaskDirective,
        NgxMaskPipe,
        MatPaginatorModule 
    ],
    providers: [
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        provideNgxMask()
    ]
})
export class CoordenadorModule { }