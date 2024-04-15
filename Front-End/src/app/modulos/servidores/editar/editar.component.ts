import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { ServidorService } from 'src/app/services/servidor.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

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
  tipoServidores: string[] = [
    'administrador',
    'professor',
    'coordenador',
    'cra',
    'csp',
  ];

  constructor(
    private snackBarService: SnackBarService,
    private router: Router,
    private servidorService: ServidorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<EditarServidoresComponent>
  ) {}

  ngOnInit(): void {
    this.cadastrarServidor = new FormGroup({
      prontuario: new FormControl(this.data.prontuario, [Validators.required]),
      nome: new FormControl(this.data.nome, [Validators.required]),
      email: new FormControl(this.data.email, [Validators.required]),
      tiposervidor: new FormControl(this.data.tiposervidor, [
        Validators.required,
      ]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nome.trim() === '') {
      this.snackBarService.open('Nome deve ser preenchido corretamente.');
      const element = document.getElementById('nome');
      if (element) {
        element.focus();
      }

      return;
    }

    if (this.email.trim() === '') {
      this.snackBarService.open('E-mail deve ser preenchido corretamente.');
      const element = document.getElementById('email');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.cadastrarServidor.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      const fields = Object.keys(this.cadastrarServidor.controls);
      const firstInvalidField = fields.find(field => this.cadastrarServidor.get(field)!.invalid);
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.servidorService.updateServidor({
          idservidor: this.data.idservidor,
          prontuario: this.prontuario.toUpperCase(),
          nome: this.nome,
          email: this.email,
          tiposervidor: this.tiposervidor,
          senha: this.data.senha,
        });
        this.snackBarService.open('Docente editado com sucesso!!');
        this.router.navigate([`${this.user.tiposervidor}/listarServidores`]);
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.snackBarService.open(`Falha ao editar docente: ${errorMessage}`);
        } else {
          this.snackBarService.open('Falha ao editar docente');
        }
      }
    }
  }

  cancelar() {
    this.dialog.close();
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

  mostrarCampo() {
    return this.user.tiposervidor == 'administrador';
  }
}
