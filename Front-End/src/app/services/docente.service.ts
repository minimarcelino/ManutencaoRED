import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class docenteService {
    constructor(private http: HttpClient, private authentication: authenticationService){}

    async getDocente(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createDocente(docente: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/create`, docente, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateDocente(docente: any): Promise<any>{
        try {
            const response = await this.http.put(`${environment.API}/update/${docente.idservidor}`, docente, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteDocente(id: number): Promise<any>{
        try {
            const response = await this.http.delete(`${environment.API}/delete/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }
}