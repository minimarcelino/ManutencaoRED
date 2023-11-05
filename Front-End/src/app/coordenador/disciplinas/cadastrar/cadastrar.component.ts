import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { disciplinaService } from 'src/app/services/disciplina.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarDisciplinaComponent implements OnInit{

  cadastrarDisciplina!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  
  constructor(private snackBar: MatSnackBar, private router: Router, private disciplinaservice: disciplinaService){}

  ngOnInit(): void {
    this.cadastrarDisciplina = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomedisciplina: new FormControl('', [Validators.required]),
      curso_idcurso: new FormControl('', [Validators.required]),
    });
  }

  async submit() {
    if (this.cadastrarDisciplina.invalid || this.isSubmitting) {
      this.openSnackBar("Campos Obrigatórios", null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.disciplinaservice.createDisciplina({
          sigla: this.sigla.toUpperCase(),
          nomedisciplina: this.nomedisciplina,
          curso_idcurso: this.curso_idcurso
        }); 
        this.openSnackBar("Disciplina cadastrada com sucesso!", null);
        this.router.navigate(['coordenador/listarDisciplinas'])
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar("Falha ao cadastrar disciplina", errorMessage);
        } else {
          this.openSnackBar("Falha ao cadastrar disciplina", "Ocorreu um erro durante o cadastro da disciplina.");
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

  voltar(){
    this.router.navigate(['/coordenador/listarDisciplinas'])
  }

  get sigla(){
    return this.cadastrarDisciplina.get('sigla')!.value;
  }

  get nomedisciplina() {
    return this.cadastrarDisciplina.get('nomedisciplina')!.value;
  }

  get curso_idcurso() {
    return this.cadastrarDisciplina.get('curso_idcurso')!.value;
  }

}
