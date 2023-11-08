import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { docenteService } from 'src/app/services/docente.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarDocenteComponent implements OnInit{

  cadastrarDocente!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;
  
  constructor(private snackBar: MatSnackBar, private router: Router, private docenteservice: docenteService){}

  ngOnInit(): void {
    this.cadastrarDocente = new FormGroup({
      prontuario: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.cadastrarDocente.invalid || this.isSubmitting) {
      this.openSnackBar("Campos Obrigatórios", null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.docenteservice.createDocente({
          prontuario: this.prontuario.toUpperCase(),
          nome: this.nome,
          email: this.email,
          tiposervidor: 'professor',
          senha: '123'
        }); 
        this.openSnackBar("Docente cadastrado com sucesso!!", null);
        if(this.user.tiposervidor == 'administrador'){
          this.router.navigate(['admin/listarDocentes']);
        } else {
          this.router.navigate(['coordenador/listar'])
        }
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar("Falha ao cadastrar docente", errorMessage);
        } else {
          this.openSnackBar("Falha ao cadastrar docente", "Ocorreu um erro durante o cadastro do docente.");
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
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['/admin/listarDocentes'])
    } else {
      this.router.navigate(['/coordenador/listar'])
    }
  }

  get prontuario(){
    return this.cadastrarDocente.get('prontuario')!.value;
  }

  get nome() {
    return this.cadastrarDocente.get('nome')!.value;
  }

  get email() {
    return this.cadastrarDocente.get('email')!.value;
  }

}
