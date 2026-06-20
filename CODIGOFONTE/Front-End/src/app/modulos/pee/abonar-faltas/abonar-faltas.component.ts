import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-abonar-falta',
  templateUrl: './abonar-falta.component.html',
  styleUrls: ['./abonar-falta.component.css'],
})
export class AbonarFaltaComponent implements OnInit {

  abonarFaltaPEE!: FormGroup;
  isSubmitting = false;
  user: any;

  constructor(
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AbonarFaltaComponent>,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private peeService: PeeService
  ) { }

  ngOnInit(): void {

    // Locale do datepicker
    this.locale = 'pt-BR';
    this.adapter.setLocale(this.locale);

    // Formulário
    this.abonarFaltaPEE = new FormGroup({
      avaliacaoAtividade: new FormControl('', [Validators.required]),
      entregaAluno: new FormControl('', [Validators.required]),
      cumprimento: new FormControl('', [Validators.required]),
      novaAtividade: new FormControl('', [Validators.required]),
      percentualAbono: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),

      avaliacao: new FormControl('', [Validators.required]),

      avaliacaoRealizada: new FormControl(null),
      dataAvaliacao: new FormControl(null),
    });

    // Controle da pergunta "Houve avaliação?"
    this.abonarFaltaPEE.get('avaliacao')?.valueChanges.subscribe(valor => {

      const avaliacaoRealizada =
        this.abonarFaltaPEE.get('avaliacaoRealizada');

      const dataAvaliacao =
        this.abonarFaltaPEE.get('dataAvaliacao');

      if (valor === 'Sim') {

        avaliacaoRealizada?.setValidators([
          Validators.required
        ]);

        dataAvaliacao?.setValidators([
          Validators.required
        ]);

      } else {

        avaliacaoRealizada?.clearValidators();
        dataAvaliacao?.clearValidators();

        avaliacaoRealizada?.setValue(null);
        dataAvaliacao?.setValue(null);

        avaliacaoRealizada?.markAsUntouched();
        dataAvaliacao?.markAsUntouched();
      }

      avaliacaoRealizada?.updateValueAndValidity();
      dataAvaliacao?.updateValueAndValidity();
    });

    // Usuário
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
  }

  limitarPercentual(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = Number(input.value);

    if (valor > 100) {
      valor = 100;
    }

    if (valor < 0) {
      valor = 0;
    }

    input.value = valor.toString();

    this.abonarFaltaPEE.get('percentualAbono')?.setValue(valor, {
      emitEvent: false
    });
  }

  async submit() {

  if (this.abonarFaltaPEE.invalid || this.isSubmitting) {

    this.mostrarErrosFormulario();

    this.abonarFaltaPEE.markAllAsTouched();

    const fields = Object.keys(this.abonarFaltaPEE.controls);

    const firstInvalidField = fields.find(
      (field) => this.abonarFaltaPEE.get(field)!.invalid
    );


    if (firstInvalidField) {

      const element = document.getElementById(firstInvalidField);

      if (element) {
        element.focus();
      }

    }

    return;
  }


  if (!this.avaliacaoAtividade.trim()) {

    this.snackBarService.open(
      'A avaliação da atividade não pode estar vazia.'
    );

    const element = document.getElementById('avaliacaoAtividade');

    if (element) {
      element.focus();
    }

    return;
  }


  if (this.percentualAbono < 0 || this.percentualAbono > 100) {

    this.snackBarService.open(
      'O percentual de abono deve estar entre 0 e 100.'
    );

    const element = document.getElementById('percentualAbono');

    if (element) {
      element.focus();
    }

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


    this.snackBarService.open(
      'Faltas abonadas com sucesso!'
    );


    this.dialog.close(true);


  } catch (error: any) {


    const msg = error?.error?.data 
      || 'Falha ao abonar as faltas';


    this.snackBarService.open(msg);


  } finally {

    this.isSubmitting = false;

  }

}


private mostrarErrosFormulario() {

  const campos = this.abonarFaltaPEE.controls;


  if (campos['avaliacaoAtividade']?.hasError('required')) {

    this.snackBarService.open(
      'A avaliação da atividade é obrigatória.'
    );

    return;
  }


  if (campos['entregaAluno']?.hasError('required')) {

    this.snackBarService.open(
      'A data de entrega da atividade é obrigatória.'
    );

    return;
  }


  if (campos['dataAvaliacao']?.hasError('required')) {

    this.snackBarService.open(
      'A data da avaliação é obrigatória.'
    );

    return;
  }


  if (campos['percentualAbono']?.hasError('required')) {

    this.snackBarService.open(
      'O percentual de abono é obrigatório.'
    );

    return;
  }


  this.snackBarService.open(
    'Verifique os campos preenchidos.'
  );

}

  cancelar() {
    this.dialog.close(false);
  }

  // ===== GETTERS =====
  get avaliacaoAtividade(): string {
    return this.abonarFaltaPEE.get('avaliacaoAtividade')?.value || '';
  }

  get entregaAluno() {
    return this.abonarFaltaPEE.get('entregaAluno')?.value;
  }

  get cumprimento() {
    return this.abonarFaltaPEE.get('cumprimento')?.value;
  }

  get novaAtividade() {
    return this.abonarFaltaPEE.get('novaAtividade')?.value;
  }

  get percentualAbono(): number {
    return Number(this.abonarFaltaPEE.get('percentualAbono')?.value || 0);
  }

  get avaliacao() {
    return this.abonarFaltaPEE.get('avaliacao')?.value ?? null;
  }

  get avaliacaoRealizada() {
    return this.abonarFaltaPEE.get('avaliacaoRealizada')?.value ?? null;
  }

  get dataAvaliacao() {
    return this.abonarFaltaPEE.get('dataAvaliacao')?.value ?? null;
  }
}