import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { alunoService } from 'src/app/services/alunos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cursoService } from 'src/app/services/cursos.service';
import { HttpClient } from '@angular/common/http';
import { servidorService } from 'src/app/services/servidor.service';

@Component({
  selector: 'app-processo-red',
  templateUrl: './processo-red.component.html',
  styleUrls: ['./processo-red.component.css']
})
export class ProcessoREDComponent implements OnInit {
  constructor(private router: Router, private alunoservice: alunoService, private cursoservice: cursoService, private servidorservice: servidorService) { }

  alunos: any[] = [];
  cursos: any[] = [];
  inputCurso: any = '';
  filtredCursos: any[] = [];
  cadastrarRed!: FormGroup;
  isDisable: boolean = false;


  ngOnInit(): void {
    this.cadastrarRed = new FormGroup({
      aluno: new FormControl('', [Validators.required]),
      curso: new FormControl('', [Validators.required]),
      afastamento: new FormControl('', [Validators.required]),
      periodo_inicio: new FormControl('', [Validators.required]),
      periodo_fim: new FormControl('', [Validators.required]),
    });
    this.fetchAlunos();
  }

  displayFn(aluno: any): string {
    let pront = aluno.prontuario;
    let nome = aluno.nome;
    let pront_aluno = pront + ' - ' + nome;
    return aluno && pront_aluno;

  }


  InputFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const pdf = event.target.files[0];
      const formData = new FormData();
      formData.append('pdf', pdf);
    }
  }

  async fetchAlunos() {
    const response = await this.alunoservice.getAluno();
    this.alunos = response.data.alunos;
  }


  async fetchCursos() {
    const response = await this.cursoservice.getCursos();
    this.cursos = response.data.cursos;
    this.filtredCursos = this.cursos.filter(curso => curso.idcurso === this.aluno.curso_idcurso);
    this.inputCurso = this.filtredCursos[0].nomecurso;
  }

  changeCurso() {
    this.fetchCursos();
    this.isDisable = true;
  }

  async cadastrar() {
    try {
      console.log(this.filtredCursos)
      await this.servidorservice.createRED({
        motivoAfastamento: this.afastamento,
        dataInicioRed: this.periodo_inicio,
        dataPrevisaoTermino: this.periodo_fim,
        data_inicio_processo: new Date(),
        dataLimitePee: new Date(),
        situacao: this.situacao,
        aluno_prontuario: this.aluno.prontuario,
        aluno: {
          connect: {
            id: this.alunos[0].id
          }
        },
        servidor: {
          connect: {
            idservidor: this.filtredCursos[0].cordenador
          }
        }

      });
    } catch (error) {
      console.error('Error submitting ProcessoRED:', error);
    }
  }


  teste() {
    this.router.navigate(['/cra/cadastrar'])
    console.log("funcionou");
  }

  get aluno() {
    return this.cadastrarRed.get('aluno')!.value;
  }
  
  get curso() {
    return this.cadastrarRed.get('curso')!.value;
  }

  get periodo_inicio() {
    return this.cadastrarRed.get('periodo_inicio')!.value;
  }

  get periodo_fim() {
    return this.cadastrarRed.get('periodo_fim')!.value;
  }

  get afastamento() {
    return this.cadastrarRed.get('afastamento')!.value;
  }

  get situacao() {
    return "Em análise";
  }


  get limite_pee() {
    return this.cadastrarRed.get('limite_pee')!.value;
  }

}