import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServidorService } from 'src/app/services/servidor.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
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
    private servidorService: ServidorService
  ) {}

  ngOnInit(): void {
    this.cadastrarServidor = new FormGroup({
      prontuario: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      tiposervidor: new FormControl(''),
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

    let catServidor =
      this.tiposervidor.charAt(0).toUpperCase() + this.tiposervidor.slice(1);
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
    } else {
      this.isSubmitting = true;
      try {
        await this.servidorService.createServidor({
          prontuario: this.prontuario.trim().toUpperCase(),
          nome: this.nome.trim(),
          email: this.email.trim(),
          tiposervidor: this.tiposervidor || 'professor',
          senha: this.gerarPalavraAleatoria(8),
        });
        this.snackBarService.open(`${catServidor} cadastrado com sucesso!!`);
        this.voltar();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.snackBarService.open(`Falha ao cadastrar ${catServidor}: ${errorMessage}`);
        } else {
          this.snackBarService.open(`Falha ao cadastrar ${catServidor}`);
        }
      }
    }
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

  mostrarCampo() {
    return this.user.tiposervidor === 'administrador';
  }

  gerarPalavraAleatoria(tamanho: number) {
    var letras = 'abcdefghijklmnopqrstuvwxyz@#1234567890';
    var palavra = '';
    for (var i = 0; i < tamanho; i++) {
      var indice = Math.floor(Math.random() * letras.length);
      palavra += letras.charAt(indice);
    }
    console.log(palavra);
    return palavra;
  }

}
