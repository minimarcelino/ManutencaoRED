import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { sessionService } from './session.service'; // Renomeei para seguir a convenção de nomenclatura

@Injectable({
  providedIn: 'root',
})
export class authenticationService {
  private tokenKey = 'auth_token'; // Chave para armazenar o token no localStorage
  userLogged: any;
  private token: string | null = null;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private session: sessionService
  ) {
    this.init();
  }

  private init() {
    this.reloadTokenFromStorage();
    this.getLogUser();
  }

  private async getLogUser() {
    this.userLogged = await this.session.getSession();
    return this.userLogged;
  }

  public async isLogado() {
    let token = await this.getToken();
    return !!token; // Retorna true se o token existir
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getHttpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
      }),
    };
    return httpOptions;
  }

  private reloadTokenFromStorage() {
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedToken) {
      this.token = storedToken;
      this.loggedIn.next(true);
    }
  }

  private async saveTokenToStorage(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  async login(usuario: {
    prontuario: string;
    senha: string;
  }): Promise<boolean> {
    try {
      const resultado: any = await this.http
        .post<boolean>(`${environment.API}login`, usuario)
        .toPromise();
      this.saveTokenToStorage(resultado.token);
      this.session.setSession(resultado.data);
      await this.getLogUser();
      return true;
    } catch (err) {
      this.saveTokenToStorage(null);
      return false;
    }
  }

  async getToken() {
    return this.token;
  }

  async logout() {
    this.saveTokenToStorage(null);
    this.session.clearSession();
    this.loggedIn.next(false);
  }
}
