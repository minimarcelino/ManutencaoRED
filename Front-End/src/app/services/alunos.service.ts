import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  async getAluno(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}aluno/all`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async createAluno(aluno: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}aluno/create`,
          aluno,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async updateAluno(aluno: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}aluno/update/${aluno.id}`,
          aluno,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async deleteAluno(id: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}aluno/delete/${id}`,
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