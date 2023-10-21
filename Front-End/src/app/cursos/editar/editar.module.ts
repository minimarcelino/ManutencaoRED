import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { editarCursoRoutingModule } from './editarCurso-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditarComponent } from './editar.component';

@NgModule({
    declarations: [
      EditarComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatSnackBarModule,
      editarCursoRoutingModule
    ]
  })
  export class EditarCursoModule { }