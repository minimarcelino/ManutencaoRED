import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PeeService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {}

  async getPee(): Promise<any> {
    try {
      const response = await this.http
        .get(`${environment.API}pee/all`, this.authenticationService.getHttpOptions())
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
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
      this.authenticationService.tratarErro(error);
    }
  }

  async getPeeByIdRED(id: number): Promise<any> {
    try {
      const response = await this.http
        .get(
          `${environment.API}pee/red/${id}`,
          this.authenticationService.getHttpOptions()
        )
        .toPromise();
      return response;
    } catch (error) {
      this.authenticationService.tratarErro(error);
    }
  }

  situacaoPEEs(pee: any[]): string {
    const situacoes = [
      "Aguardando Associação de Professor",
      "Aguardando Preenchimento",
      "Enviada ao Aluno",
      "Avaliado"
    ];

    for (const situacao of situacoes) {
      if (pee.some(item => item.situacao === situacao)) {
        return situacao;
      }
    }
    return "Em Associação de Disciplina";
  }

  todosPeesPreenchidos(pee: any[]): boolean {
    return pee.every((item) => item.situacao === "Avaliado");
  }
}
