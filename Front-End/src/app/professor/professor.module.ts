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
import { ListarPeesComponent } from './listar/listar.component';
import { CadastrarPeeComponent } from './cadastrar-pee/cadastrar-pee.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AbonarFaltaComponent } from './abonar-faltas/abonar-faltas.component';
import { PeesAbonadosComponent } from './pees-abonados/pees-abonados.component';


@NgModule({
    declarations: [
      ListarPeesComponent,
      CadastrarPeeComponent,
      AbonarFaltaComponent,
      PeesAbonadosComponent
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