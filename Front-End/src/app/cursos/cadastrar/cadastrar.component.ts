import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cursoService } from '../../services/cursos.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit{

  cadastrarCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: any[] = [];


  constructor(private cursoservice: cursoService){}

  ngOnInit(): void {
    this.cadastrarCurso = new FormGroup({
      sigla: new FormControl('', Validators.required),
      nomeCurso: new FormControl('', Validators.required),
      Coordenador: new FormControl('', Validators.required),
    });
    this.fetchCoordenador();
  }

  async submit() {
    try {
      const curso = {
        sigla: this.sigla,
        nomecurso: this.nomeCurso,
        servidor: {
          connect: {
            idservidor: this.idcordenador
          }
        }
      };
  
      await this.cursoservice.createCurso(curso);
    } catch (error) {
      console.error('Error submitting curso:', error);
    }
  }

  displayFn(Coordenador: any): string {
    return Coordenador && Coordenador.email;
  }

  async fetchCoordenador(){
    const response = await this.cursoservice.getCoordenador();
    this.servidores = response.data.servidores;
    this.coordenadores = this.servidores.filter(coordenador => coordenador.tiposervidor === 1);

  }
  

  get sigla(){
    return this.cadastrarCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.cadastrarCurso.get('nomeCurso')!.value;
  }

  get idcordenador() {
    return this.cadastrarCurso.get('Coordenador')!.value.idservidor;
  }
}
