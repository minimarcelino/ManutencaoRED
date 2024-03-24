import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { authenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CoordenadorService {
  constructor(
    private http: HttpClient,
    private authentication: authenticationService
  ) {}

  async getCoordenador(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}coordenador/all`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCoordenadorById(id: number): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}coordenador/${id}`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }


}
