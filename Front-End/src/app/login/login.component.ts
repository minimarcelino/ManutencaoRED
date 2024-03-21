import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sessionService } from '../services/session.service';
import { authenticationService } from '../services/authentication.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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


  constructor(
    private router: Router,
    private sessionservice: sessionService,
    private authentication: authenticationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      prontuario: new FormControl('', Validators.required),
      senha: new FormControl('', Validators.required),
    });
  }

  async fazerLogin() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos!', '', { duration: 3000 });
      return;
    } else {
      this.logging = await this.authentication.login({ prontuario: this.prontuario, senha: this.senha });
      if (this.logging) {
        this.user = localStorage.getItem("user");
        if (this.user != null) {
          this.user = JSON.parse(this.user);
          this.sessionservice.setSession(this.user); // Armazena o usuário na sessão
          this.router.navigate([`/${this.user.tiposervidor}`]);
        }
        this.snackBar.open('Login bem sucedido!', '', { duration: 3000 });
      } else {
        this.snackBar.open('Email ou senha incorretos!', '', { duration: 3000 });
      }
    }
  }
  get prontuario() {
    return this.loginForm.get('prontuario')!.value;
  }

  get senha() {
    return this.loginForm.get('senha')!.value;
  }


}
