import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CursoService } from '../../../services/cursos.service';
import { CoordenadorService } from 'src/app/services/coordenador.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css'],
})
export class CadastrarCursoComponent implements OnInit {
  cadastrarCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: any[] = [];
  isSubmitting: boolean = false;
  user: any;

  constructor(
    private cursoservice: CursoService,
    private coodenadorService: CoordenadorService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cadastrarCurso = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomeCurso: new FormControl('', [Validators.required]),
      Coordenador: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.buscarCoordenador();
  }

  async submit() {
    if (this.cadastrarCurso.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      // Encontra o primeiro campo inválido e coloca o foco nele
      const fields = Object.keys(this.cadastrarCurso.controls);
      const firstInvalidField = fields.find(field => this.cadastrarCurso.get(field)!.invalid);
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    if (this.sigla.trim() === '') {
      this.snackBarService.open('Sigla deve ser preenchida corretamente.');
      const element = document.getElementById('sigla');
      if (element) {
        element.focus();
      }
      return;
          
    }
    
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.nomeCurso.trim() === '') {
      this.snackBarService.open(
        'Nome do curso deve ser preenchido corretamente.'
      );
      const element = document.getElementById('nome');
      if (element) {
        element.focus();
      }
      return;
    }

    

    // Todos os campos obrigatórios estão preenchidos corretamente
    this.isSubmitting = true;
    try {
      await this.cursoservice.createCurso({
        sigla: this.sigla.toUpperCase(),
        nomeCurso: this.nomeCurso,
        coordenador: this.idcordenador,
      });
      this.snackBarService.open('Curso cadastrado com sucesso!!');
      this.voltar();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao cadastrar curso: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao cadastrar curso');
      }
    }
  }

  voltar() {
    this.router.navigate([`/${this.user.tiposervidor}/listarCursos`]);
  }

  displayFn(Coordenador: any): string {
    return Coordenador && Coordenador.nome;
  }

  async buscarCoordenador() {
    const response = await this.coodenadorService.getCoordenador();
    this.coordenadores = response.data;
  }

  get sigla() {
    return this.cadastrarCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.cadastrarCurso.get('nomeCurso')!.value;
  }

  get idcordenador() {
    return this.cadastrarCurso.get('Coordenador')!.value.idservidor;
  }
}
