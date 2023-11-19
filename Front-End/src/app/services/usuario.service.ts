import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environmente.development';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class usuarioNaoAutenticadoService {
    constructor(private http: HttpClient) { }

    async getPee(id: number): Promise<any> {
        try {
            const response = await this.http.get(`${environment.API}/usuario/${id}`)
                .toPromise();
            return response;
        } catch (error) {
            throw error;
        }
    }
}