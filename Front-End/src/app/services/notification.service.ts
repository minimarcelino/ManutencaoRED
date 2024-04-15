import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { SessionService } from './session.service'; // Renomeei para seguir a convenção de nomenclatura

@Injectable({
  providedIn: 'root',
})
export class NotificationService {


  constructor(
    private http: HttpClient,
    private session: SessionService
  ) {}

  async sendEmailResetPassword(prontuario: string): Promise<any> {
    try {
      const response = await this.http
        .post(`${environment.API}usuario/recoveryPassword`, {prontuario: prontuario})
        .toPromise();
      return response;
    } catch (error) {
      return error;
    }
  }
}
