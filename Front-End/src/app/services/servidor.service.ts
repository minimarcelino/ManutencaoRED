import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  async getServidores(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}servidor/all`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async createServidor(servidor: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}servidor/create`,
          servidor,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async updateServidor(servidor: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}servidor/update/${servidor.idservidor}`,
          servidor,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async deleteServidor(idservidor: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}servidor/delete/${idservidor}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async alterarPerfil(servidor: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}servidor/updatePerfil/${servidor.idservidor}`,
          servidor,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async alterarSenha(id: number, token: string, senha: string): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}usuario/trocar-senha`,
          { id: id, senha: senha, token: token},
        ).toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }
}

