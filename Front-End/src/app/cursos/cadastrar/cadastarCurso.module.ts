import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastrarComponent } from './cadastrar.component';
import { cadastrarCursoRoutingModule } from './cadastrarCurso-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CadastrarComponent
  ],
  imports: [
    CommonModule,
    cadastrarCursoRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CadastrarCursoModule { }
