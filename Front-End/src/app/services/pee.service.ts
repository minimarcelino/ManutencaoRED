import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class peeService {
    constructor(private http: HttpClient, private authentication: authenticationService){}

    async getRed(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/pee/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createRed(pee: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/pee/create`, pee, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateRed(pee: any): Promise<any>{
        try {
            const response = await this.http.put(`${environment.API}/pee/update/${pee.idpee}`, pee, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteRed(id: number): Promise<any>{
        try {
            const response = await this.http.delete(`${environment.API}/pee/delete/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }
}