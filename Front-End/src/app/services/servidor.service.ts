import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { authenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ServidorService {
  constructor(
    private http: HttpClient,
    private authentication: authenticationService
  ) {}

  async getServidores(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}/servidor/all`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createServidor(docente: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}/servidor/create`,
          docente,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateServidor(docente: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}/servidor/update/${docente.idservidor}`,
          docente,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteServidor(idservidor: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}/servidor/delete/${idservidor}`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async alterarPerfil(servidor: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}/servidor/updatePerfil/${servidor.idservidor}`,
          servidor,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
