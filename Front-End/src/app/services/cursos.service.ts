import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class cursoService{

    constructor(private http: HttpClient, private authentication: authenticationService){}

    async createCurso(curso: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/curso/create`, curso, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getCoordenador(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/curso/all`, this.authentication.getHttpOptions())
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}