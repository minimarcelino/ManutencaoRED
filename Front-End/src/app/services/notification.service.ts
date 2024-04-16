import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { SessionService } from './session.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {


  constructor(
    private http: HttpClient,
    private session: SessionService,
    private authenticationService: AuthenticationService
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

  async sendEmailProfessor(idProfessor: number, idPee: number): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}pee/sendEmailProfessor`, {idProfessor: idProfessor, idPee: idPee}
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
  
}
