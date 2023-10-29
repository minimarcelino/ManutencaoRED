import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { alunoService } from 'src/app/services/alunos.service';
import { cursoService } from 'src/app/services/cursos.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit{
  cadastrarAluno!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;

  constructor(private snackBar: MatSnackBar, private router: Router, private alunoService: alunoService,
              private cursoService: cursoService, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string){}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.cadastrarAluno = new FormGroup({
      prontuario: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      curso: new FormControl('', [Validators.required]),
    });
    this.fetchCurso();
  }

  async submit() {
    if (this.cadastrarAluno.invalid || this.isSubmitting) {
      this.openSnackBar(true);
      return;
    } else {
      this.isSubmitting = true;
      try {
        console.log(this.data_nascimento);
        await this.alunoService.createAluno({
          prontuario: this.prontuario.toUpperCase(),
          nome: this.nome,
          data_nascimento: this.data_nascimento,
          endereco: this.endereco,
          telefone: this.telefone,
          email: this.email,
          curso_idcurso: this.idcurso
        }); 
        this.openSnackBar(false);
        this.router.navigate(['cra/listar'])
      } catch (error) {
        console.error('Error submitting curso:', error);
      }
    }
  }

  async fetchCurso(){
    const getCursos = await this.cursoService.getCursos();
    this.cursos = getCursos.data.cursos;
  }

  displayFn(curso: any): string {
    return curso && curso.nomecurso;
  }

  openSnackBar(option: boolean) {
    if(option){
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'Os campos são obrigatórios!!.',
        duration: 3000
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'O aluno foi cadastrado com sucesso!!.',
        duration: 3000
      });
    }
  }

    voltar(){
      this.router.navigate(['/cra/listar'])
    }

    get prontuario(){
      return this.cadastrarAluno.get('prontuario')!.value;
    }
  
    get nome() {
      return this.cadastrarAluno.get('nome')!.value;
    }
    get data_nascimento() {
      return this.cadastrarAluno.get('data')!.value;
    }
  
    get endereco() {
      return this.cadastrarAluno.get('endereco')!.value;
    }

    get telefone() {
      return this.cadastrarAluno.get('telefone')!.value;
    }

    get email() {
      return this.cadastrarAluno.get('email')!.value;
    }

    get idcurso() {
      return this.cadastrarAluno.get('curso')!.value.idcurso;
    }
}
