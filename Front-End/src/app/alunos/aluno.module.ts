import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunosComponent } from './alunos.component';
import { alunoRoutingModule } from './aluno-routing.module';



@NgModule({
    declarations: [
       
    ],
    imports: [
      CommonModule,
      alunoRoutingModule
    ]
  })
  export class AlunoModule { }