import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environment.development';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RedService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  // 📎 BUSCAR ARQUIVOS
  async getAttachedFiles(id: number): Promise<any> {
    try {
      const response = await this.http.get(
        `${environment.API}red/files/${id}`,
        this.authenticationService.getHttpOptions()
      ).toPromise();

      return response || null;

    } catch (error) {
      this.authenticationService.tratarErro(error);
      return null;
    }
  }

  // 📄 BUSCAR REDS
  async getRed(): Promise<any> {
    try {
      const response = await this.http.get(
        `${environment.API}red/all`,
        this.authenticationService.getHttpOptions()
      ).toPromise();

      return response || { data: { reds: [] } };

    } catch (error) {
      this.authenticationService.tratarErro(error);

      // 🔥 EVITA QUEBRA NO COMPONENTE
      return { data: { reds: [] } };
    }
  }

  // ➕ CRIAR RED
  async createRed(red: any, arquivos: File[]): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('red', JSON.stringify(red));

      arquivos.forEach(file => {
        formData.append('arquivos', file);
      });

      const response = await this.http.post(
        `${environment.API}red/create`,
        formData,
        this.authenticationService.getHttpOptions()
      ).toPromise();

      return response || null;

    } catch (error) {
      this.authenticationService.tratarErro(error);
      return null;
    }
  }

  // ✏️ ATUALIZAR RED
  async updateRed(red: any, arquivos: File[]): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('red', JSON.stringify(red));

      arquivos.forEach(file => {
        formData.append('arquivos', file);
      });

      const response = await this.http.post(
        `${environment.API}red/update/${red.idRED}`,
        formData,
        this.authenticationService.getHttpOptions()
      ).toPromise();

      return response || null;

    } catch (error) {
      this.authenticationService.tratarErro(error);
      return null;
    }
  }

  // 🔄 ATUALIZAR SITUAÇÃO
  async updateSituacaoRED(red: any): Promise<any> {
    try {
      const response = await this.http.put(
        `${environment.API}red/update/situacao/${red.idRED}`,
        red,
        this.authenticationService.getHttpOptions()
      ).toPromise();

      return response || null;

    } catch (error) {
      this.authenticationService.tratarErro(error);
      return null;
    }
  }

  // 🗑️ DELETAR RED
  async deleteRed(id: number): Promise<any> {
    try {
      const response = await this.http.delete(
        `${environment.API}red/delete/${id}`,
        this.authenticationService.getHttpOptions()
      ).toPromise();

      return response || null;

    } catch (error) {
      this.authenticationService.tratarErro(error);
      return null;
    }
  }

  // 🔍 BUSCAR RED POR ID
  async getRedById(id: number): Promise<any> {

    try {

      const response = await this.http.get(

        `${environment.API}red/${id}`,

        this.authenticationService.getHttpOptions()

      ).toPromise();

      return response || null;

    } catch (error) {

      this.authenticationService.tratarErro(error);

      return null;

    }

  }

  // 🗑️ DELETAR ARQUIVO (OBSERVABLE)
  deleteFile(idFile: number): Observable<any> {
    return this.http.delete(
      `${environment.API}arquivos/${idFile}`,
      this.authenticationService.getHttpOptions()
    );
  }

  buscarPorAluno(id:number){

  return this.http.get(
    `${environment.API}red/aluno/${id}`,
    this.authenticationService.getHttpOptions()
  );

}

}