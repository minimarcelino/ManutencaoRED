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
  ) { }

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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
    }
  }

  async exportDisciplina(disciplina: any): Promise<any> {
    try {

      console.log(disciplina);

      const response = await this.http
        .post(
          `${environment.API}disciplina/import`,
          disciplina,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();

      return response;

    } catch (error) {

      this.authenticationService.tratarErro(error);

    }
  }
}
