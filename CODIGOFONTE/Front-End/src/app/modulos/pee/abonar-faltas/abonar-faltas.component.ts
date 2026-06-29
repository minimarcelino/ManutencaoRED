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


  // AVALIAÇÃO DA ATIVIDADE
  if (campos['avaliacaoAtividade']?.hasError('required')) {

    this.snackBarService.open(
      'A avaliação da atividade é obrigatória.'
    );

    return;
  }



  // DATA DE ENTREGA
  if (campos['entregaAluno']?.hasError('required')) {

    this.snackBarService.open(
      'A data de entrega da atividade é obrigatória.'
    );

    return;
  }


  if (campos['entregaAluno']?.hasError('pattern')) {

    this.snackBarService.open(
      'Data de entrega inválida. Utilize o formato DD/MM/AAAA.'
    );

    return;
  }




  // CUMPRIMENTO DA ATIVIDADE
  if (campos['cumprimento']?.hasError('required')) {

    this.snackBarService.open(
      'Informe se o aluno cumpriu com as atividades.'
    );

    return;
  }




  // NOVA ATIVIDADE
  if (campos['novaAtividade']?.hasError('required')) {

    this.snackBarService.open(
      'Informe se houve uma nova atividade.'
    );

    return;
  }




  // PERCENTUAL DE ABONO
  if (campos['percentualAbono']?.hasError('required')) {

    this.snackBarService.open(
      'O percentual de abono é obrigatório.'
    );

    return;
  }


  if (campos['percentualAbono']?.hasError('min')) {

    this.snackBarService.open(
      'O percentual de abono deve ser maior ou igual a 0.'
    );

    return;
  }


  if (campos['percentualAbono']?.hasError('max')) {

    this.snackBarService.open(
      'O percentual de abono deve ser menor ou igual a 100.'
    );

    return;
  }




  // HOUVE AVALIAÇÃO
  if (campos['avaliacao']?.hasError('required')) {

    this.snackBarService.open(
      'Informe se houve avaliação.'
    );

    return;
  }




  // AVALIAÇÃO REALIZADA (aparece somente se avaliação = Sim)
  if (
    campos['avaliacao']?.value === 'Sim' &&
    campos['avaliacaoRealizada']?.hasError('required')
  ) {

    this.snackBarService.open(
      'Informe se a avaliação já foi realizada.'
    );

    return;
  }




  // DATA DA NOVA AVALIAÇÃO (aparece somente se avaliação = Sim)
  if (
    campos['avaliacao']?.value === 'Sim' &&
    campos['dataAvaliacao']?.hasError('required')
  ) {

    this.snackBarService.open(
      'A data da avaliação é obrigatória.'
    );

    return;
  }


  if (
    campos['avaliacao']?.value === 'Sim' &&
    campos['dataAvaliacao']?.hasError('pattern')
  ) {

    this.snackBarService.open(
      'Data da avaliação inválida. Utilize o formato DD/MM/AAAA.'
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