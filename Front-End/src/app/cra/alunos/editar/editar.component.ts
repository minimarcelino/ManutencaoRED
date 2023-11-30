import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { alunoService } from 'src/app/services/alunos.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { cursoService } from '../../../services/cursos.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { curso } from 'src/app/modelo/curso';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit{

  editarAluno!: FormGroup;
  cursos: curso[] = [];
  isSubmitting: boolean = false;
  user: any;

  constructor(private alunoService: alunoService, private snackBar: MatSnackBar, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<EditarComponent>,  
    private cursoService: cursoService, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string){}

    ngOnInit(): void {
      var date = new Date(this.data.data);
      var utcYear = date.getUTCFullYear();
      var utcMonth = date.getUTCMonth();
      var utcDay = date.getUTCDate();
      var utcDate = new Date(utcYear, utcMonth, utcDay);  
      this.editarAluno = new FormGroup({
        prontuario: new FormControl(this.data.prontuario, [Validators.required]),
        nome: new FormControl(this.data.nome, [Validators.required]),
        data: new FormControl(utcDate, [Validators.required]),
        endereco: new FormControl(this.data.endereco, [Validators.required]),
        telefone: new FormControl(this.data.telefone, [Validators.required]),
        email: new FormControl(this.data.email, [Validators.required]),
        curso: new FormControl(this.data.curso, [Validators.required]),
      });
      this.fetchCurso();
      this._adapter.setLocale('pt-BR');
      this.displayFn(this.data.curso);
    }
  
    async submit() {
      if (this.editarAluno.invalid || this.isSubmitting) {
        this.openSnackBar("Campos obrigatórios!!", null);
        return;
      } else {
        this.isSubmitting = true;
        try {
          await this.alunoService.updateAluno({
            id: this.data.id,
            prontuario: this.prontuario.toUpperCase(),
            nome: this.nome,
            data_nascimento: this.data_nascimento,
            endereco: this.endereco,
            telefone: this.telefone,
            email: this.email,
            curso: this.idcurso
          }); 
          this.openSnackBar("Aluno editado com sucesso!!", null);
          this.dialog.close();
        } catch (error: any) {
          if (error && error.error && error.error.data) {
            const errorMessage = error.error.data;
            this.openSnackBar("Falha ao editar aluno", errorMessage);
          } else {
            this.openSnackBar("Falha ao editar aluno", "Ocorreu um erro durante a edição do aluno.");
          }
        }
      }
    }
    
    openSnackBar(message: string, error: string | Error | null) {
      let data;
      if (error === null) {
        data = { message };
      } else if (typeof error === 'string') {
        data = { message: error };
      } else if (error instanceof Error) {
        data = { message: error.message };
      }
      
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: data,
        duration: 3000
      });
    }

    cancelar() {
      this.dialog.close();
    }

    async fetchCurso(){
      const getCursos = await this.cursoService.getCursos();
      this.cursos = getCursos.data.cursos;
    }
  
    displayFn(curso: curso): string {
      return curso && curso.nomeCurso;
    }
    
    get prontuario(){
      return this.editarAluno.get('prontuario')!.value;
    }
  
    get nome() {
      return this.editarAluno.get('nome')!.value;
    }
    get data_nascimento() {
      return this.editarAluno.get('data')!.value;
    }
  
    get endereco() {
      return this.editarAluno.get('endereco')!.value;
    }

    get telefone() {
      return this.editarAluno.get('telefone')!.value;
    }

    get email() {
      return this.editarAluno.get('email')!.value;
    }

    get idcurso() {
      return this.editarAluno.get('curso')!.value.idcurso;
    }
}
