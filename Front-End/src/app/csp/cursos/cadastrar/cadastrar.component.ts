import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cursoService } from '../../../services/cursos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent implements OnInit{

  cadastrarCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: any[] = [];
  isSubmitting: boolean = false;


  constructor(private cursoservice: cursoService, private snackBar: MatSnackBar, private router: Router){}

  ngOnInit(): void {
    this.cadastrarCurso = new FormGroup({
      sigla: new FormControl('', [Validators.required]),
      nomeCurso: new FormControl('', [Validators.required]),
      Coordenador: new FormControl('', [Validators.required]),
    });
    this.fetchCoordenador();
  }

  async submit() {
    if (this.cadastrarCurso.invalid || this.isSubmitting) {
      this.openSnackBar(true);
      return;
    } else {
      this.isSubmitting = true;
      try {
        const curso = {
          sigla: this.sigla.toUpperCase(),
          nomecurso: this.nomeCurso,
          cordenador: this.idcordenador
        };

        await this.cursoservice.createCurso(curso); 
        this.openSnackBar(false);
        this.router.navigate(['csp/listar'])
        
      } catch (error) {
        console.error('Error submitting curso:', error);
      }
    }
  }

  voltar(){
    this.router.navigate(['/csp/listar'])
  }

  openSnackBar(option: boolean) {
    if(option){
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'Os campos são obrigatórios!!.',
        duration: 3000
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: 'O curso foi cadastrado com sucesso!!.',
        duration: 3000
      });
    }
      
  }

  displayFn(Coordenador: any): string {
    return Coordenador && Coordenador.email;
  }

  async fetchCoordenador(){
    const response = await this.cursoservice.getCoordenador();
    this.servidores = response.data.servidores;
    this.coordenadores = this.servidores.filter(coordenador => coordenador.tiposervidor === 'coordenador');

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
