import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environmente.development';
import { storageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class authenticationService implements OnInit {
  userlogged: any;
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private storage: storageService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.init();
  }

  async init() {
    await this.reloadIfTokenIsNull();
    this.getLogUser();
  }

  async getLogUser() {
    this.userlogged = await this.storage.get('user');
    return this.userlogged;
  }

  async isLogado() {
    let token = await this.getToken()
    return token ? true : false;
  } 

  private async reloadIfTokenIsNull() {
    if (this.token == null || this.token == undefined) {
      const tokenWithQuotes = await this.storage.get('token');

      if (tokenWithQuotes) {
        this.token = tokenWithQuotes.replace(/["']/g, '');
      }
    }
    return this.token;
  }

  async login(usuario: { email: string; senha: string; }): Promise<boolean> {
    if (usuario) {
      return this.http
        .post<boolean>(`${environment.API}/servidor/login`, usuario)
        .toPromise()
        .then((resultado: any) => {
          this.token = resultado.token;
          this.storage.set("token", this.token);
          this.storage.set("user", resultado.data);
          return true;
        })
        .catch((err) => {
          this.token = null;
          return false;
        });
    }
    return false;
  }

  async getToken() {
    await this.reloadIfTokenIsNull();
    return this.token;
  }
}
