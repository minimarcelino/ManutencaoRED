import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnaliseRedService } from '../../services/analise-red.service';

@Component({
  selector: 'app-analise-reds',
  templateUrl: './analise-reds.component.html',
  styleUrls: ['./analise-reds.component.css']
})


export class AnaliseRedsComponent implements OnInit {

  alunos: any[] = [];
  totalAlunos = 0;
  alunosRecorrentes = 0;
  totalReds = 0;


  constructor(
    private service: AnaliseRedService,
    private router: Router
  ) { }


 ngOnInit(): void {

  this.service.buscar()
    .subscribe((dados: any) => {

      this.alunos = dados.alunos;

      // Ordena do aluno com mais REDs para o com menos REDs
      this.alunos.sort((a, b) => {
        return b.quantidade - a.quantidade;
      });

      this.totalAlunos = dados.totalAlunos;
      this.totalReds = dados.totalReds;
      this.alunosRecorrentes = dados.alunosRecorrentes;

    });
}

 abrirDetalhes(aluno: any): void {
  this.router.navigate([
    '/detalhes-red',
    aluno.id
  ]);
  }

  voltar(){

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const nivel = user.tiposervidor;

  switch(nivel){

    case 'coordenador':
      this.router.navigate(['/coordenador/home']);
      break;

    case 'cra':
      this.router.navigate(['/cra/home']);
      break;

    case 'csp':
      this.router.navigate(['/csp/home']);
      break;

    case 'professor':
      this.router.navigate(['/professor/home']);
      break;

    case 'administrador':
      this.router.navigate(['/administrador/home']);
      break;

    case 'docente':
      this.router.navigate(['/docente']);
      break;

    default:
      this.router.navigate(['/login']);
      break;
  }

}

mesAbreviado(data: any): string {

  if (!data) {
    return '';
  }

  const meses = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ];


  // caso venha uma data tipo 2026-06-28
  if (typeof data === 'string' && data.includes('-')) {

    const partes = data.split('-');

    const ano = partes[0];
    const mes = Number(partes[1]);

    return `${meses[mes - 1]}/${ano}`;
  }


  // caso venha só número do mês
  if(typeof data === 'number') {

    return `${meses[data - 1]}/2026`;

  }


  return data;

}


}