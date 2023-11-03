import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class alunoService {
    constructor(private http: HttpClient, private authentication: authenticationService){}

    async getAluno(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/aluno/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createAluno(aluno: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/aluno/create`, aluno, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateAluno(aluno: any): Promise<any>{
        try {
            const response = await this.http.put(`${environment.API}/aluno/update/${aluno.id}`, aluno, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteAluno(id: number): Promise<any>{
        try {
            const response = await this.http.delete(`${environment.API}/aluno/delete/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

}