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
}
