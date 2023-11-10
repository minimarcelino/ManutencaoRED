import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cursoService } from '../../../services/cursos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarCursoComponent implements OnInit{

  cadastrarCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: any[] = [];
  isSubmitting: boolean = false;
  user:any;

  constructor(private cursoservice: cursoService, private snackBar: MatSnackBar, private router: Router){}

  ngOnInit(): void {
    this.cadastrarCurso = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomeCurso: new FormControl('', [Validators.required]),
      Coordenador: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.fetchCoordenador();
  }

  async submit() {
    if (this.cadastrarCurso.invalid || this.isSubmitting) {
      this.openSnackBar("Campos obrigatórios!!", null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.cursoservice.createCurso({
          sigla: this.sigla.toUpperCase(),
          nomeCurso: this.nomeCurso,
          coordenador: this.idcordenador}); 
        this.openSnackBar("Curso cadastrado com sucesso!!", null);
        if(this.user.tiposervidor == 'administrador'){
          this.router.navigate(['admin/listarCursos']);
        } else {
          this.router.navigate(['csp/listar']);
        }
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar("Falha ao cadastrar curso", errorMessage);
        } else {
          this.openSnackBar("Falha ao cadastrar curso", "Ocorreu um erro durante o cadastro do curso.");
        }
      }
    }
  }

  voltar(){
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['admin/listarCursos']);
    } else {
      this.router.navigate(['/csp/listar']);
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

  displayFn(Coordenador: any): string {
    return Coordenador && Coordenador.email;
  }

  async fetchCoordenador(){
    const response = await this.cursoservice.getCoordenador();
    this.servidores = response.data.servidores;
    this.coordenadores = this.servidores.filter(coordenador => coordenador.tiposervidor === 'coordenador');

  }
  
  get sigla(){
    return this.cadastrarCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.cadastrarCurso.get('nomeCurso')!.value;
  }

  get idcordenador() {
    return this.cadastrarCurso.get('Coordenador')!.value.idservidor;
  }
}
