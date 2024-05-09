import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CoordenadorService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  async getCoordenador(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}coordenador/all`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async getCoordenadorById(id: number): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}coordenador/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

}
