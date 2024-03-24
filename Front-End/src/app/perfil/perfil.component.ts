import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { SnackBarComponent } from '../utils/snack-bar/snack-bar.component';
import { ServidorService } from '../services/servidor.service';

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
    private snackBar: MatSnackBar,
    private servidorService: ServidorService  ) {}

  ngOnInit(): void {
    this.alterarPerfil = new FormGroup({
      senha: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.alterarPerfil.invalid || this.isSubmitting) {
      this.openSnackBar('Campos Obrigatórios', null);
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
        this.openSnackBar('Perfil alterado com sucesso!!', null);
        this.router.navigate([`/${this.user.tiposervidor}`]);
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          // Verifica se o erro é devido a um prontuário duplicado
          if (errorMessage.includes('prontuario')) {
            this.openSnackBar('Falha ao alterar perfil', 'Falha ao alterar perfil');
          } else {
            this.openSnackBar('Falha ao alterar perfil', errorMessage);
          }
        } else {
          this.openSnackBar(
            'Falha ao alterar perfil',
            'Ocorreu um erro durante a alteração do perfil.'
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

  get senha() {
    return this.alterarPerfil.get('senha')!.value;
  }
}
