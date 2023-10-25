import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { alunoService } from 'src/app/services/alunos.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { cursoService } from '../../../services/cursos.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit{

  editarAluno!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;

  constructor(private alunoService: alunoService, private snackBar: MatSnackBar, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<EditarComponent>,  
    private cursoService: cursoService){}

    ngOnInit(): void {
      this.editarAluno = new FormGroup({
        prontuario: new FormControl(this.data.prontuario, [Validators.required]),
        nome: new FormControl(this.data.nome, [Validators.required]),
        data: new FormControl(this.data.data, [Validators.required]),
        endereco: new FormControl(this.data.endereco, [Validators.required]),
        telefone: new FormControl(this.data.telefone, [Validators.required]),
        email: new FormControl(this.data.email, [Validators.required]),
        curso: new FormControl('', [Validators.required]),
      });
      this.fetchCurso();
    }
  
    async submit() {
      if (this.editarAluno.invalid || this.isSubmitting) {
        this.openSnackBar(true);
        return;
      } else {
        this.isSubmitting = true;
        try {
          await this.alunoService.updateAluno({
            id: this.data.id,
            prontuario: this.prontuario,
            nome: this.nome,
            data_nascimento: this.data_nascimento,
            endereco: this.endereco,
            telefone: this.telefone,
            email: this.email,
            curso: {
              connect: {
                idcurso: this.curso.idcurso
              }
            }
          }); 
          this.openSnackBar(false);
          this.router.navigate(['cra/listar']);
        } catch (error) {
          console.error('Error submitting curso:', error);
        }
      }
    }
    

    openSnackBar(option: boolean) {
      if(option){
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: 'Os campos são obrigatórios!!.',
          duration: 3000
        });
      } else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: 'O aluno foi editado com sucesso!!.',
          duration: 3000
        });
      }
    }

    async fetchCurso(){
      const getCursos = await this.cursoService.getCursos();
      this.cursos = getCursos.data.cursos;
    }
  
    displayFn(curso: any): string {
      return curso && curso.nomecurso;
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

    get curso() {
      return this.editarAluno.get('curso')!.value;
    }
}
