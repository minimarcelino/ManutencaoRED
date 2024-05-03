import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DisciplinaService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  async getDisciplina(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}disciplina/all`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async createDisciplina(disciplina: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}disciplina/create`,
          disciplina,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async updateDisciplina(disciplina: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}disciplina/update/${disciplina.iddisciplinas}`,
          disciplina,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async deleteDisciplina(iddisciplinas: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}disciplina/delete/${iddisciplinas}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.tratarErro(error);
    }
  }

  async exportDisciplina(Disciplina: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}disciplina/create`,
          Disciplina,
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