import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { docenteService } from 'src/app/services/docente.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarServidoresComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<EditarServidoresComponent>
  ) {}

  ngOnInit(): void {
    this.cadastrarServidor = new FormGroup({
      prontuario: new FormControl(this.data.prontuario, [Validators.required]),
      nome: new FormControl(this.data.nome, [Validators.required]),
      email: new FormControl(this.data.email, [Validators.required]),
      tiposervidor: new FormControl(this.data.tiposervidor, [Validators.required,]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {

    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nome.trim() === '') {
      this.openSnackBar('Nome deve ser preenchido corretamente.', null);
      return;
    }

    if (this.email.trim() === '') {
      this.openSnackBar('E-mail deve ser preenchido corretamente.', null);
      return;
    }

    if (this.cadastrarServidor.invalid || this.isSubmitting) {
      this.openSnackBar('Campos Obrigatórios', null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.docenteservice.updateDocente({
          idservidor: this.data.idservidor,
          prontuario: this.prontuario.toUpperCase(),
          nome: this.nome,
          email: this.email,
          tiposervidor: this.tiposervidor,
          senha: this.data.senha,
        });
        this.openSnackBar('Docente editado com sucesso!!', null);
        this.router.navigate([`${this.user.tiposervidor}/listarServidores`]);
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar('Falha ao editar docente', errorMessage);
        } else {
          this.openSnackBar(
            'Falha ao editar docente',
            'Ocorreu um erro durante a edição do docente.'
          );
        }
      }
    }
  }

  cancelar() {
    this.dialog.close();
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
    return this.user.tiposervidor == 'administrador'
  }
}
