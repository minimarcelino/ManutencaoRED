import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class CursoService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  async getCursos(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}curso/all`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async getCursoById(id: number): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}curso/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async createCurso(curso: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}curso/create`,
          curso,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async updateCurso(curso: any): Promise<any> {
    try {
      console.log(curso);
      const response = await this.http
        .put(
          `${environment.API}curso/update/${curso.idcurso}`,
          curso,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  async deleteCurso(id: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}curso/delete/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }
}
