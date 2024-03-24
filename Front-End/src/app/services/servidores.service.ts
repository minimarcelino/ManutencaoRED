import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { authenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})

export class servidoresService {
  constructor(private http: HttpClient, private authentication: authenticationService) { }
  async createRED(red: any): Promise<any> {
    try {
      const response = await this.http.post(`${environment.API}/cra/processo-red/create`, red, this.authentication.getHttpOptions())
        .toPromise()
      return response;
    } catch (error) {
      throw error;
    }
  }

/*   async exportProfessor(Professor: any): Promise<any>{
    try {
        const response = await this.http.post(`${environment.API}/create`, Professor, this.authentication.getHttpOptions())
        .toPromise()
        return response;
    } catch (error) {
      throw error;
    }
  } */


}
