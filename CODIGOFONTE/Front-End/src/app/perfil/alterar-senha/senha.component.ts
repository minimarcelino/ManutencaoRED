import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServidorService } from '../../services/servidor.service';
import { SnackBarService } from '../../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
  styleUrls: ['./senha.component.css'],
})
export class SenhaComponent implements OnInit {

  alterarPerfil!: FormGroup;
  isSubmitting: boolean = false;
  user: any;

  constructor(
    private router: Router,
    private snackBarService: SnackBarService,
    private servidorService: ServidorService,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<SenhaComponent>
  ) {}

  ngOnInit(): void {
    this.alterarPerfil = new FormGroup({
      senhaAtual: new FormControl('', [Validators.required]),
      novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmarSenha: new FormControl('', [Validators.required]),
    });

    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
  }

  async submit() {

    if (this.alterarPerfil.invalid || this.isSubmitting) {
      this.snackBarService.open('Preencha todos os campos!');
      this.alterarPerfil.markAllAsTouched();
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.snackBarService.open('As senhas não coincidem!');
      return;
    }

    const loginValido = await this.authenticationService.login({
      prontuario: this.user.prontuario,
      senha: this.senhaAtual,
    });

    if (!loginValido) {
      this.snackBarService.open('Senha atual incorreta!');
      return;
    }

    this.isSubmitting = true;

    try {
      await this.servidorService.alterarPerfil({
        idservidor: this.user.idservidor,
        email: this.user.email,
        senha: this.novaSenha,
        tiposervidor: this.user.tiposervidor,
        nome: this.user.nome,
        prontuario: this.user.prontuario,
      });

      this.snackBarService.open('Senha alterada com sucesso!');

      this.dialogRef.close(); // ✅ fecha modal

      this.authenticationService.logout();
      this.router.navigate(['/login']);

    } catch (error: any) {

      if (error?.error?.data) {
        this.snackBarService.open(`Erro: ${error.error.data}`);
      } else {
        this.snackBarService.open('Erro ao alterar senha');
      }

    } finally {
      this.isSubmitting = false;
    }
  }

  // ✅ CANCELAR CORRETO (SEM BUG)
  cancelar(): void {
    this.dialogRef.close(); // 🔥 SÓ ISSO!
  }

  get senhaAtual() {
    return this.alterarPerfil.get('senhaAtual')?.value;
  }

  get novaSenha() {
    return this.alterarPerfil.get('novaSenha')?.value;
  }

  get confirmarSenha() {
    return this.alterarPerfil.get('confirmarSenha')?.value;
  }
}