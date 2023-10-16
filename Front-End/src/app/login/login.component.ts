import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authenticationService } from '../services/authentication.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup;
  logging: boolean = true;

  constructor(
    private router: Router,
    private authentication: authenticationService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      prontuario: new FormControl('', Validators.required),
      senha: new FormControl('', Validators.required),
    });
  }

  async fazerLogin() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.logging = await this.authentication.login({ prontuario: this.prontuario, email: this.senha });
      if(this.logging)
        this.router.navigate(['home']);
      console.log('sucesso!');
    }
  }

  get prontuario() {
    return this.loginForm.get('prontuario')!.value;
  }

  get senha() {
    return this.loginForm.get('senha')!.value;
  }
}
