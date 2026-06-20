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


}