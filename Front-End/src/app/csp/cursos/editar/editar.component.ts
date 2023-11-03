import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { cursoService } from 'src/app/services/cursos.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit{

  editarCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: any[] = [];
  isSubmitting: boolean = false;

  constructor(private cursoservice: cursoService, private snackBar: MatSnackBar, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<EditarComponent>){}

  ngOnInit(): void {
    this.editarCurso = new FormGroup({
      sigla: new FormControl(this.data.sigla, [Validators.required]),
      nomeCurso: new FormControl(this.data.nomecurso, [Validators.required]),
      Coordenador: new FormControl(this.data.coordenador, [Validators.required]),
    });
    this.fetchCoordenador();
  }

  async submit() {
    if (this.editarCurso.invalid || this.isSubmitting) {
      this.openSnackBar("Campos obrigatórios!!", null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        const curso = {
          idcurso: this.data.idcurso,
          sigla: this.sigla.toUpperCase(),
          nomecurso: this.nomeCurso,
          cordenador: this.idcordenador
        };
        await this.cursoservice.updateCurso(curso); 
        this.openSnackBar("Curso editado com sucesso!!", null);
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar("Falha ao editar curso", errorMessage);
        } else {
          this.openSnackBar("Falha ao editar curso", "Ocorreu um erro durante a edição do curso.");
        }
      }
      this.dialog.close('Confirmar');
    }
  }

  async fetchCoordenador(){
    const response = await this.cursoservice.getCoordenador();
    this.servidores = response.data.servidores;
    this.coordenadores = this.servidores.filter(coordenador => coordenador.tiposervidor === 'coordenador');
  }


  openSnackBar(message: string, error: string | Error | null) {
    let data;
    if (error === null) {
      data = { message };
    } else if (typeof error === 'string') {
      data = { message: error };
    } else if (error instanceof Error) {
      data = { message: error.message };
    }
    
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: data,
      duration: 3000
    });
  }

  displayFn(Coordenador: any): string {
    return Coordenador && Coordenador.email;
  }

  get sigla(){
    return this.editarCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.editarCurso.get('nomeCurso')!.value;
  }

  get idcordenador() {
    return this.editarCurso.get('Coordenador')!.value.idservidor;
  }
}
