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
    private router: Router
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
      this.tratarErro(error);
    }
  }

  async createServidor(docente: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}servidor/create`,
          docente,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async updateServidor(docente: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}servidor/update/${docente.idservidor}`,
          docente,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
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
      this.tratarErro(error);
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
      this.tratarErro(error);
    }
  }

  async tratarErro(error: any) {
    if (!(error.status === 401) && !(error.status === 500)) {
      throw error;
    }
    if (error.status === 401) {
      alert('Desconectado por inatividade.');
    } else if (error.status === 500) {
      alert('Erro interno do servidor. Por favor, tente novamente.');
    }
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

