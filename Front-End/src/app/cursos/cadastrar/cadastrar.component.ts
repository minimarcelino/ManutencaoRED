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
  coordenadores: any[] = [];

  constructor(private cursoservice: cursoService){}

  ngOnInit(): void {
    this.cadastrarCurso = new FormGroup({
      sigla: new FormControl('', Validators.required),
      curso: new FormControl('', Validators.required),
      coordenador: new FormControl('', Validators.required),
    });
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

  async fetchCoordenador(){
    const response = await this.cursoservice.getCoordenador();
    this.coordenadores = response;
  }
  

  get sigla(){
    return this.cadastrarCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.cadastrarCurso.get('curso')!.value;
  }

  get idcordenador() {
    return this.cadastrarCurso.get('coordenador')!.value;
  }
}
