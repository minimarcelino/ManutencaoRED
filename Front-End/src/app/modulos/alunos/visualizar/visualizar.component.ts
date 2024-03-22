import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { messageDialog } from 'src/app/services/messageDialog.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css'],
})
export class VisualizarAlunoComponent implements OnInit {
  visualizarAluno!: FormGroup;
  user: any;

  constructor(
    public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<VisualizarAlunoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    var date = new Date(this.data.dataNascimento);
    var utcYear = date.getUTCFullYear();
    var utcMonth = date.getUTCMonth();
    var utcDay = date.getUTCDate();
    var utcDate = new Date(utcYear, utcMonth, utcDay);
    this.visualizarAluno = new FormGroup({
      nome: new FormControl({ value: this.data.nome, disabled: true }, [Validators.required,]),
      prontuario: new FormControl({ value: this.data.prontuario, disabled: true },[Validators.required]),
      metodologia: new FormControl({ value: this.data.metodologia, disabled: true },[Validators.required]),
      dataNascimento: new FormControl({ value: utcDate, disabled: true }, [Validators.required,]),
      endereco: new FormControl({ value: this.data.endereco, disabled: true }, [Validators.required,]),
      telefone: new FormControl({ value: this.data.telefone, disabled: true }, [Validators.required,]),
      email: new FormControl({ value: this.data.email, disabled: true }, [Validators.required,]),
      curso: new FormControl({ value: this.data.curso.nomeCurso, disabled: true },[Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  cancelar() {
    this.dialog.close();
  }
}
