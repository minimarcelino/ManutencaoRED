import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class PeeService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  async getPee(): Promise<any> {
    try {
      const response = await this.http
        .get(`${environment.API}pee/all`, this.authenticationService.getHttpOptions())
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createPee(pee: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}pee/create`,
          pee,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createAtividade(atividade: any): Promise<any> {
    try {
      const response = await this.http
        .post(
          `${environment.API}pee/createAtividade`,
          atividade,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updatePee(pee: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}pee/update/${pee.idpee}`,
          pee,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateAtividade(atividade: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}pee/update/${atividade.idatividades}`,
          atividade,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateWithEmail(pee: any): Promise<any> {
    try {
      const response = await this.http
        .put(
          `${environment.API}pee/updateWithEmail/${pee.idpee}`,
          pee,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deletePee(id: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}pee/delete/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteAtividade(id: number, idpee: number): Promise<any> {
    try {
      const response = await this.http
        .delete(
          `${environment.API}pee/deleteAtividade/${id}/${idpee}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPeeRED(id: number): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}pee/red/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }








}
