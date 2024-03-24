import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { authenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  constructor(
    private http: HttpClient,
    private authentication: authenticationService
  ) {}

  async getCursos(): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}/curso/all`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCursoById(id: number): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}/curso/${id}`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createCurso(curso: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}/curso/create`,
          curso,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateCurso(curso: any): Promise<any> {
    try {
      console.log(curso);
      const response = await this.http
        .put(
          `${environment.API}/curso/update/${curso.idcurso}`,
          curso,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteCurso(id: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}/curso/delete/${id}`,
          this.authentication.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
