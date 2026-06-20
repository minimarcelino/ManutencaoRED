import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
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
import { MatDialogModule } from '@angular/material/dialog';
import { AbonarFaltaComponent } from 'src/app/modulos/pee/abonar-faltas/abonar-faltas.component';
import { FormularioPEEComponent } from 'src/app/modulos/pee/formulario-PEE/formulario-pee.component';
import { GerenciarPEEComponent } from 'src/app/modulos/pee/gerenciar/gerenciar-pee.component';
import { ListarPEEComponent } from 'src/app/modulos/pee/listar/listar-pee.component';
import { AssociarProfessoresComponent } from 'src/app/modulos/associacoes/associar-professores/associar-professores.component';
import { HomeProfessorComponent } from './home/home-professor.component';

@NgModule({
    declarations: [
      ListarPEEComponent,
      AbonarFaltaComponent,
      FormularioPEEComponent,
      GerenciarPEEComponent,
      AssociarProfessoresComponent,
      HomeProfessorComponent
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
      MatDatepickerModule,
      MatDialogModule,
      RouterModule
    ],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      provideNgxMask()
    ]
  })
  export class ProfessorModule { }
