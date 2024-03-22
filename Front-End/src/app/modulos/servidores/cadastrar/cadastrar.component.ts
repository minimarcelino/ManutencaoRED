import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { docenteService } from 'src/app/services/docente.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css'],
})
export class CadastrarServidoresComponent implements OnInit {
  cadastrarServidor!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;
  tipoServidores: string[] = ["administrador", "professor", "coordenador", "cra", "csp"];

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private docenteservice: docenteService,
  ) {}

  ngOnInit(): void {
    this.cadastrarServidor = new FormGroup({
      prontuario: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      tiposervidor: new FormControl(''),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    let catServidor =  this.tiposervidor.charAt(0).toUpperCase() + this.tiposervidor.slice(1);
    if (this.cadastrarServidor.invalid || this.isSubmitting) {
      this.openSnackBar('Campos Obrigatórios', null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.docenteservice.createDocente({
          prontuario: this.prontuario.trim().toUpperCase(),
          nome: this.nome.trim(),
          email: this.email.trim(),
          tiposervidor: this.tiposervidor || 'professor',
          senha: '123',
        });
        this.openSnackBar(`${catServidor} cadastrado com sucesso!!`, null);
        this.voltar();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar(`Falha ao cadastrar ${catServidor}`, errorMessage);
        } else {
          this.openSnackBar(
            `Falha ao cadastrar ${catServidor}`,
            `Ocorreu um erro durante o cadastro do ${catServidor}.`
          );
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
      duration: 3000,
    });
  }

  voltar() {
    this.router.navigate([`/${this.user.tiposervidor}/listarServidores`]);
  }

  get prontuario() {
    return this.cadastrarServidor.get('prontuario')!.value;
  }

  get nome() {
    return this.cadastrarServidor.get('nome')!.value;
  }

  get email() {
    return this.cadastrarServidor.get('email')!.value;
  }

  get tiposervidor() {
    return this.cadastrarServidor.get('tiposervidor')!.value;
  }

  mostrarCampo(){
    return this.user.tiposervidor === 'administrador'
  }
}
