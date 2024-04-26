import { Component, OnInit } from '@angular/core';
import { usuarioNaoAutenticadoService } from '../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-usuario-nao-autenticado',
  templateUrl: './usuario-nao-autenticado.component.html',
  styleUrls: ['./usuario-nao-autenticado.component.css']
})
export class UsuarioNaoAutenticadoComponent implements OnInit {

  dadosPee: any; // Variável para armazenar os dados retornados
  hash!: string;

  constructor(private route: ActivatedRoute, private usuarioservice: usuarioNaoAutenticadoService) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.hash = params['hash'];
      try {
        const response = await this.usuarioservice.getPee(this.hash);
        this.dadosPee = response.data;
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    });
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }

}