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
    private router: Router
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
      this.tratarErro(error);
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