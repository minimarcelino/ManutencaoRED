import { NgModule } from '@angular/core';
import { DisciplinasComponent } from '../coordenador/disciplinas/disciplinas.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
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
import { VisualizarComponent } from './visualizacaoRed/visualizar/visualizar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditarDisciplinaComponent} from './disciplinas/editar/editar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssociarProfessoresComponent } from './associar-professores/associar-professores.component';
import { PeeComponent } from './pee/pee.component';
@NgModule({
    declarations: [
        DisciplinasComponent,
        CadastrarDocenteComponent,
        ListarDocenteComponent,
        EditarDocenteComponent,
        ListarRedComponent,
        CadastrarDisciplinaComponent,
        VisualizarComponent,
        EditarDisciplinaComponent,
        AssociarProfessoresComponent,
        PeeComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatSnackBarModule,
        MatTableModule,
        MatMomentDateModule,
        NgxMaskDirective,
        NgxMaskPipe,
        MatPaginatorModule,
        MatDatepickerModule 
    ],
    providers: [
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        provideNgxMask()
    ]
})
export class CoordenadorModule { }