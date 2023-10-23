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
import { storageService } from '../services/storage.service';

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
    private authentication: authenticationService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      senha: new FormControl('', Validators.required),
    });
  }

  async fazerLogin() {
    if (this.loginForm.invalid) {
      return;
    } else {
        this.logging = await this.authentication.login({ email: this.email, senha: this.senha });
      if(this.logging){
        this.user = localStorage.getItem("user");
        if(this.user != null){
          this.user = JSON.parse(this.user);
          if(this.user.tiposervidor == 'csp'){
            this.router.navigate(['/csp']);
          } else if (this.user.tiposervidor == 'cra') {
            this.router.navigate(['/cra']);
          }
        }
      }    
      console.log('sucesso!');
    }
  }

  get email() {
    return this.loginForm.get('email')!.value;
  }

  get senha() {
    return this.loginForm.get('senha')!.value;
  }
}
