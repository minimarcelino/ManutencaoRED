import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class disciplinaService {
    constructor(private http: HttpClient, private authentication: authenticationService){}

    async getDisciplina(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/disciplina/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createDisciplina(disciplina: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/disciplina/create`, disciplina, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateDisciplina(disciplina: any): Promise<any>{
        try {
            const response = await this.http.put(`${environment.API}/disciplina/update/${disciplina.iddisciplinas}`, disciplina, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteDisciplina(id: number): Promise<any>{
        try {
            const response = await this.http.delete(`${environment.API}/disciplina/delete/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }
}