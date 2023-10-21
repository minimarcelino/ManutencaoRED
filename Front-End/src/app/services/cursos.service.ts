import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class cursoService{

    constructor(private http: HttpClient, private authentication: authenticationService){}

    async getCursos(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/curso/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async createCurso(curso: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/curso/create`, curso, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async updateCurso(curso: any): Promise<any>{
        try {
            console.log(curso);
            const response = await this.http.put(`${environment.API}/curso/update/${curso.idcurso}`, curso, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getCoordenador(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/servidor/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getCoordenadorById(id: number): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/servidor/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCurso(id: number): Promise<any>{
        try {
            const response = await this.http.delete(`${environment.API}/curso/delete/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}