import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RedService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  async getRed(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}red/all`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async createRed(red: any, arquivos: File[]): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('red', JSON.stringify(red));
      for (let i = 0; i < arquivos.length; i++) {
        formData.append('arquivos', arquivos[i]);
      }

      const response = await this.http
        .post(
          `${environment.API}red/create`,
          formData,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async updateRed(red: any): Promise<any> {
    try {
      console.log(red);
      const response = await this.http
        .put(
          `${environment.API}red/update/${red.idRED}`,
          red,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async updateSituacaoRED(red: any): Promise<any> {
    try {
      console.log(red);
      const response = await this.http
        .put(
          `${environment.API}red/update/situacao/${red.idRED}`,
          red,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async deleteRed(id: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}red/delete/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }
}
