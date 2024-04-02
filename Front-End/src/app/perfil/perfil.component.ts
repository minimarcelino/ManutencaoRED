import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServidorService } from '../services/servidor.service';
import { SnackBarService } from '../services/snackbar.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  alterarPerfil!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(
    private router: Router,
    private snackBarService: SnackBarService,
    private servidorService: ServidorService
  ) {}

  ngOnInit(): void {
    this.alterarPerfil = new FormGroup({
      senha: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.alterarPerfil.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.servidorService.alterarPerfil({
          idservidor: this.user.idservidor,
          email: this.user.email,
          senha: this.senha,
          tiposervidor: this.user.tiposervidor,
          nome: this.user.nome,
          prontuario: this.user.prontuario,
        });
        this.snackBarService.open('Perfil alterado com sucesso!!');
        this.router.navigate([`/${this.user.tiposervidor}`]);
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          // Verifica se o erro é devido a um prontuário duplicado
          if (errorMessage.includes('prontuario')) {
            this.snackBarService.open(`Prontuário duplicado`);
          } else {
            this.snackBarService.open(`Falha ao alterar perfil: ${errorMessage}`);
          }
        } else {
          this.snackBarService.open('Falha ao alterar perfil');
        }
      }
    }
  }

  get senha() {
    return this.alterarPerfil.get('senha')!.value;
  }
}
