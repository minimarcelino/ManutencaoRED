import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.css']
})
export class VisualizarPEEComponent implements OnInit{

  visualizarPee!: FormGroup;
  user: any;
  
  constructor(private snackBar: MatSnackBar, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialogRef<VisualizarPEEComponent>, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string) { }

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    var date = new Date(this.data.prazofinal);
    var utcYear = date.getUTCFullYear();
    var utcMonth = date.getUTCMonth();
    var utcDay = date.getUTCDate();
    var utcDate = new Date(utcYear, utcMonth, utcDay);  
    this.visualizarPee = new FormGroup({
      conteudo: new FormControl({value: this.data.conteudo, disabled: true}, [Validators.required]),
      metodologia: new FormControl({value: this.data.metodologia, disabled: true}, [Validators.required]),
      trabalhos: new FormControl({value: this.data.trabalhos, disabled: true}, [Validators.required]),
      bibliografia: new FormControl({value: this.data.bibliografia, disabled: true}, [Validators.required]),
      exigencia: new FormControl({value: this.data.criterios, disabled: true}, [Validators.required]),
      prazo: new FormControl({value: utcDate, disabled: true}, [Validators.required]),
      contato: new FormControl({value: this.data.servidor.email, disabled: true}, [Validators.required]),
      comunicacao: new FormControl({value: this.data.canalComunicacao, disabled: true}),
      avaliacao: new FormControl({value: this.data.houveAvaliacao, disabled: true}),
      avaliacaoRealizada: new FormControl({value: this.data.avaliacoesRealizadas, disabled: true}),
      dataAvaliacao: new FormControl({value: this.data.dataAvaliacao, disabled: true}),
      observacao: new FormControl({value: this.data.observacao, disabled: true}),
    });
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  cancelar() {
    this.dialog.close();
  }

}
