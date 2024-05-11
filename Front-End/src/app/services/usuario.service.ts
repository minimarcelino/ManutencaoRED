import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';

@Injectable({
    providedIn: 'root',
})

export class usuarioNaoAutenticadoService {
    constructor(private http: HttpClient) { }

    async getPee(hash: string): Promise<any> {
        try {
            const response = await this.http.get(`${environment.API}usuario/${hash}`)
                .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getTrocarSenha(token: string): Promise<any> {
        try {
            const response = await this.http.get(`${environment.API}usuario/trocar-senha/${token}`)
                .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(prontuario: string, password: string): Promise<any> {
        try {
          const response = await this.http
            .post(`${environment.API}usuario/trocar-senha`, {prontuario: prontuario, password: password})
            .toPromise();
          return response;
        } catch (error) {
          return error;
        }
      }
}
