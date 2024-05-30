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
  logging: boolean = true;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(
    private router: Router,
    private snackBarService: SnackBarService,
    private servidorService: ServidorService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialogRef<SenhaComponent>,
  ) {}

  ngOnInit(): void {
    this.alterarPerfil = new FormGroup({
      senhaAtual: new FormControl('', [Validators.required]),
      novaSenha: new FormControl('', [Validators.required]),
      confirmarSenha: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.alterarPerfil.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      return;
    } else {

      const senhaAtual = this.alterarPerfil.get('senhaAtual')!.value;
      this.logging = await this.authenticationService.login({
        prontuario: this.user.prontuario,
        senha: senhaAtual,
      });
      console.log(this.logging);

      if (this.logging) {
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
        this.snackBarService.open('Perfil alterado com sucesso!!');
        this.dialog.close();
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
        this.snackBarService.open('Senha alterada!');

          this.authenticationService.logout();
          this.router.navigate(['/login']); // redireciona o usuário para a página de login após o logout

      } else {
        this.snackBarService.open('Senha incorreta!');
      }

    }
  }

  get senhaAtual() {
    return this.alterarPerfil.get('senhaAtual')!.value;
  }

  get novaSenha() {
    return this.alterarPerfil.get('novaSenha')!.value;
  }

  get confirmarSenha() {
    return this.alterarPerfil.get('confirmarSenha')!.value;
  }
}
