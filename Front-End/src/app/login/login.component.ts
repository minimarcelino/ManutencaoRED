import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthenticationService } from '../services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService} from '../services/snackbar.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup;
  logging: boolean = true;
  user: any;
  isResetPassword: boolean = false;
  isEmailSended: boolean = false;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private authenticationService: AuthenticationService,
    private snackBarService: SnackBarService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      prontuario: new FormControl('', Validators.required),
      //// REMOÇÃO DA SENHA PARA REALIZAR TESTES MAIS RAPIDAMENTE
      // senha: new FormControl('', Validators.required),
      senha: new FormControl('',),
    });
  }

  async fazerLogin() {
    if (this.loginForm.invalid) {
      this.snackBarService.open('Por favor, preencha todos os campos!');
      return;
    } else {
      this.logging = await this.authenticationService.login({
        prontuario: this.prontuario,
        //// REMOÇÃO DA SENHA PARA REALIZAR TESTES MAIS RAPIDAMENTE
        //senha: this.senha,
        senha: '123',
      });
      console.log(this.logging);

      if (this.logging) {
        this.user = localStorage.getItem('user');
        if (this.user != null) {
          this.user = JSON.parse(this.user);
          this.sessionService.setSession(this.user); // Armazena o usuário na sessão
          this.router.navigate([`/${this.user.tiposervidor}`]);
        }
        this.snackBarService.open('Login bem sucedido');
      } else {
        this.snackBarService.open('Prontuário ou senha incorretos!');
      }
    }
  }
  get prontuario() {
    return this.loginForm.get('prontuario')!.value;
  }

  get senha() {
    return this.loginForm.get('senha')!.value;
  }

  get token() {
    return this.loginForm.get('token')!.value;
  }
  
  get novaSenha() {
    return this.loginForm.get('novaSenha')!.value;
  }

  backToLogin(){
    this.isResetPassword=false;
    this.isEmailSended=false;
  }

  async resetPassword(){
    const response = await this.notificationService.sendEmailResetPassword(this.prontuario.toUpperCase());
    if(response){
      this.isEmailSended = true;
    }
  }
}
