import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
//
import { PEEAbonadosComponent } from 'src/app/modulos/pee/abonados/pees-abonados.component';
import { AbonarFaltaComponent } from 'src/app/modulos/pee/abonar-faltas/abonar-faltas.component';
import { CadastrarPEEComponent } from 'src/app/modulos/pee/cadastrar/cadastrar-pee.component';
import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';
import { GerenciarVisualizarPeeComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-visualizar/gerenciar-visualizar.component';
import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar.component';
import { VisualizarPEEComponent } from 'src/app/modulos/pee/visualizar/visualizar.component';
import { AssociarProfessoresComponent } from 'src/app/modulos/associacoes/associar-professores/associar-professores.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
      ListarPEEComponent,
      CadastrarPEEComponent,
      AbonarFaltaComponent,
      PEEAbonadosComponent,
      VisualizarPEEComponent,
      GerenciarPEEComponent,
      GerenciarVisualizarPeeComponent,
      AssociarProfessoresComponent,
      HomeComponent
  ],
    imports: [
      CommonModule,
      MatIconModule,
      ReactiveFormsModule,
      FormsModule,
      MatRadioModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatSnackBarModule,
      MatTableModule,
      MatSelectModule,
      MatMomentDateModule,
      MatPaginatorModule,
      NgxMaskPipe,
      NgxMaskDirective,
      MatCheckboxModule,
      MatTooltipModule,
      MatDatepickerModule
    ],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      provideNgxMask()
    ]
  })
  export class ProfessorModule { }
