import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class AnaliseRedService {

  constructor(
    private http: HttpClient
  ) { }



  buscar() {
    return this.http.get<any>(
      'http://localhost:3333/servidor/red/analise'
    );
  }


}