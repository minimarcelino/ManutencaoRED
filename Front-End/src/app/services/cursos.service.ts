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
    private router: Router
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
      this.tratarErro(error);
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
      this.tratarErro(error);
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
      this.tratarErro(error);
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
      this.tratarErro(error);
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