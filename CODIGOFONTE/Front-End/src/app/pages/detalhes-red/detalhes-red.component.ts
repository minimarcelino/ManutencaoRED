import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RedService } from '../../services/red.service';

@Component({
  selector: 'app-detalhes-red',
  templateUrl: './detalhes-red.component.html',
  styleUrls: ['./detalhes-red.component.css']
})


export class DetalhesRedComponent implements OnInit {
  idAluno: any;
  aluno: any = {};
  reds: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private redService: RedService
  ) { }



  ngOnInit() {
    this.idAluno = this.route.snapshot.paramMap.get('id');
    // depois você troca isso pelo backend
    this.carregarDados();
  }

  carregarDados() {
    this.redService.buscarPorAluno(this.idAluno)
      .subscribe((data: any) => {
        console.log(data);
        this.reds = data;
        this.aluno = data[0]?.aluno;
      });
  }

  voltar() {
    this.router.navigate(['/reds/analise']);
  }



}