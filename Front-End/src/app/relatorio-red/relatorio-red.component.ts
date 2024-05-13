import { Component, OnInit } from '@angular/core';
import { usuarioNaoAutenticadoService } from '../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { PeeService } from '../services/pee.service';
@Component({
  selector: 'app-relatorio-red',
  templateUrl: './relatorio-red.component.html',
  styleUrls: ['./relatorio-red.component.css']
})
export class RelatorioRedComponent {
  dadosPee: any; // Variável para armazenar os dados retornados
  id!: number;

  constructor(private route: ActivatedRoute, private peeservice: PeeService) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.id = params['id'];
      try {
        const response = await this.peeservice.getPeeByIdRED(this.id);
        this.dadosPee = response.data;
        console.log(this.dadosPee);
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    });
  }
  
}
