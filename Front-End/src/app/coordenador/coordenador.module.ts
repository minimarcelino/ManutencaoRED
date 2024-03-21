import { NgModule } from '@angular/core';
//import { DisciplinasComponent } from '../coordenador/disciplinas/disciplinas.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CadastrarDocenteComponent } from './docentes/cadastrar/cadastrar.component';
import { ListarDocenteComponent } from './docentes/listar/listar.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditarDocenteComponent  } from './docentes/editar/editar.component';
import { ListarRedComponent } from './visualizacaoRed/listar/listar.component';
//import { CadastrarDisciplinaComponent } from './disciplinas/cadastrar/cadastrar.component';
import { VisualizarComponent } from './visualizacaoRed/visualizar/visualizar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
//import { EditarDisciplinaComponent} from './disciplinas/editar/editar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssociarProfessoresComponent } from './associar-professores/associar-professores.component';
import { PeeComponent } from './pee/pee.component';
import { VisualizarPeeComponent } from './pee/visualizar-pee/visualizar-pee.component';
import { VisualizarDisciplinaComponent } from './visualizar-disciplina/visualizar-disciplina.component';
import { ListarDisciplinasComponent } from '../modulos/disciplinas/listar/disciplinas.component';
import { CadastrarDisciplinaComponent } from '../modulos/disciplinas/cadastrar/cadastrar.component';
import { EditarDisciplinaComponent } from '../modulos/disciplinas/editar/editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        ListarDisciplinasComponent,
        CadastrarDocenteComponent,
        ListarDocenteComponent,
        EditarDocenteComponent,
        ListarRedComponent,
        CadastrarDisciplinaComponent,
        VisualizarComponent,
        VisualizarPeeComponent,
        EditarDisciplinaComponent,
        AssociarProfessoresComponent,
        PeeComponent,
        VisualizarDisciplinaComponent,
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
