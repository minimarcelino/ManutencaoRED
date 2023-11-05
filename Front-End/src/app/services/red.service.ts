import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root',
  })

export class redService {
    constructor(private http: HttpClient, private authentication: authenticationService){}

    async getRed(): Promise<any>{
        try {
            const response = await this.http.get(`${environment.API}/red/all`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createRed(red: any): Promise<any>{
        try {
            const response = await this.http.post(`${environment.API}/red/create`, red, this.authentication.getHttpOptions())
            .toPromise()
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updateRed(red: any): Promise<any>{
        try {
            const response = await this.http.put(`${environment.API}/red/update/${red.idRED}`, red, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteRed(id: number): Promise<any>{
        try {
            const response = await this.http.delete(`${environment.API}/red/delete/${id}`, this.authentication.getHttpOptions())
            .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

}