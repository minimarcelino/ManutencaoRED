import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { servidor } from 'src/app/modelo/servidor';
import { CoordenadorService } from 'src/app/services/coordenador.service';
import { CursoService } from 'src/app/services/cursos.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarCursoComponent implements OnInit {
  editarCurso!: FormGroup;
  servidores: any[] = [];
  coordenadores: servidor[] = [];
  isSubmitting: boolean = false;

  constructor(
    private cursoService: CursoService,
    private coodenadorService: CoordenadorService,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<EditarCursoComponent>
  ) {}

  ngOnInit(): void {
    this.fetchCoordenador();
    this.editarCurso = new FormGroup({
      sigla: new FormControl(this.data.sigla, [Validators.required]),
      nomeCurso: new FormControl(this.data.nomeCurso, [Validators.required]),
      Coordenador: new FormControl(this.data.coordenador, [Validators.required,]),
    });
    this.displayFn(this.data.coordenador);
  }

  async submit() {
    if (this.editarCurso.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      // Encontra o primeiro campo inválido e coloca o foco nele
      const fields = Object.keys(this.editarCurso.controls);
      const firstInvalidField = fields.find(field => this.editarCurso.get(field)!.invalid);
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
    await this.cursoService.updateCurso({
      idcurso: this.data.idcurso,
      sigla: this.sigla.toUpperCase(),
      nomeCurso: this.nomeCurso,
      coordenador: this.idcordenador,
    });
    this.snackBarService.open('Curso editado com sucesso!!');
    this.dialog.close();
  } catch (error: any) {
    if (error && error.error && error.error.data) {
      const errorMessage = error.error.data;
      this.snackBarService.open(`Falha ao editar curso: ${errorMessage}`);
    } else {
      this.isSubmitting = true;
      try {
        await this.cursoService.updateCurso({
          idcurso: this.data.idcurso,
          sigla: this.sigla.toUpperCase(),
          nomeCurso: this.nomeCurso,
          coordenador: this.idcordenador,
        });
        this.snackBarService.open('Curso editado com sucesso!!');
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.snackBarService.open(`Falha ao editar curso: ${errorMessage}`);
        } else {
          this.snackBarService.open(
            'Falha ao editar curso',
          );
        }
      }
      this.dialog.close('Confirmar');
    }
  }
}


  async fetchCoordenador() {
    const response = await this.coodenadorService.getCoordenador();
    this.servidores = response.data.servidores;
    this.coordenadores = this.servidores.filter(
      (coordenador) => coordenador.tiposervidor === 'coordenador'
    );
  }

  cancelar() {
    this.dialog.close();
  }

  displayFn(Coordenador: servidor): string {
    return Coordenador && Coordenador.email;
  }

  get sigla() {
    return this.editarCurso.get('sigla')!.value;
  }

  get nomeCurso() {
    return this.editarCurso.get('nomeCurso')!.value;
  }

  get idcordenador() {
    return this.editarCurso.get('Coordenador')!.value.idservidor;
  }
}
