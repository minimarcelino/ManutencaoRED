import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-abonar-falta',
  templateUrl: './abonar-falta.component.html',
  styleUrls: ['./abonar-falta.component.css'],
})
export class AbonarFaltaComponent implements OnInit {
  abonarFaltaPEE!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AbonarFaltaComponent>,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.abonarFaltaPEE = new FormGroup({
      avaliacaoAtividade: new FormControl('', [Validators.required]),
      entregaAluno: new FormControl('', [Validators.required]),
      cumprimento: new FormControl('', [Validators.required]),
      novaAtividade: new FormControl('', [Validators.required]),
      percentualAbono: new FormControl('', [Validators.required]),
      avaliacao: new FormControl(null),
      avaliacaoRealizada: new FormControl(null),
      dataAvaliacao: new FormControl(null),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.abonarFaltaPEE.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos obrigatórios!!');
      const fields = Object.keys(this.abonarFaltaPEE.controls);
      const firstInvalidField = fields.find(field => this.abonarFaltaPEE.get(field)!.invalid);
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    if (this.avaliacaoAtividade.trim() === '') {
      this.snackBarService.open('Descrição deve ser preenchido corretamente.');
      const element = document.getElementById('descricao');
      if (element) {
        element.focus();
      }
      return;
    }



    if (this.percentualAbono < 0 || this.percentualAbono > 100) {
      this.snackBarService.open('O percentual de faltas abonadas deve ser entre 0 e 100.');
      return;
    }

    this.isSubmitting = true;
    try {

      await this.peeService.updatePee({
        editando: true,
        idpee: this.data.idpee,
        situacao: "Avaliado",
        avaliacaoAtividade: this.avaliacaoAtividade,
        prazoEntregaAtividade: this.data.prazofinal,
        dataEntregaAtividade: this.entregaAluno,
        cumpriuAtividade: this.cumprimento,
        houveAvaliacao: this.avaliacao,
        avaliacoesRealizadas: this.avaliacaoRealizada,
        dataAvaliacao: this.dataAvaliacao,
        percentualabono: this.percentualAbono,
      });
      this.snackBarService.open('Faltas abonadas com sucesso!!');
      this.dialog.close();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao abonar as Faltas: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao abonar as Faltas');
      }
    }
  }

  cancelar() {
    this.dialog.close();
  }

  get avaliacaoAtividade() {
    return this.abonarFaltaPEE.get('avaliacaoAtividade')!.value;
  }

  get entregaAluno() {
    return this.abonarFaltaPEE.get('entregaAluno')!.value;
  }

  get cumprimento() {
    return this.abonarFaltaPEE.get('cumprimento')!.value;
  }

  get novaAtividade() {
    return this.abonarFaltaPEE.get('novaAtividade')!.value;
  }

  get percentualAbono() {
    return this.abonarFaltaPEE.get('percentualAbono')!.value;
  }

  get avaliacao() {
    return this.abonarFaltaPEE.get('avaliacao')!.value || null;
  }

  get dataAvaliacao() {
    return this.abonarFaltaPEE.get('dataAvaliacao')!.value || null;
  }

  get avaliacaoRealizada() {
    return this.abonarFaltaPEE.get('avaliacaoRealizada')!.value || null;
  }
}

