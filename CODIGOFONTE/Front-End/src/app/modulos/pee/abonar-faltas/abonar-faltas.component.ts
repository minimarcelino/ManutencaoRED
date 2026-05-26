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
  ) {}

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
      percentualAbono: new FormControl('', [Validators.required]),
      avaliacao: new FormControl(null),
      avaliacaoRealizada: new FormControl(null),
      dataAvaliacao: new FormControl(null),
    });

    // Usuário
    const userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
  }

  async submit() {
    if (this.abonarFaltaPEE.invalid || this.isSubmitting) {
      this.snackBarService.open('Preencha todos os campos obrigatórios!');
      this.abonarFaltaPEE.markAllAsTouched();
      return;
    }

    // Validação extra
    if (!this.avaliacaoAtividade.trim()) {
      this.snackBarService.open('Avaliação da atividade não pode estar vazia.');
      return;
    }

    if (this.percentualAbono < 0 || this.percentualAbono > 100) {
      this.snackBarService.open('O percentual deve ser entre 0 e 100.');
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

      this.snackBarService.open('Faltas abonadas com sucesso!');
      this.dialog.close(true);

    } catch (error: any) {
      const msg = error?.error?.data || 'Falha ao abonar as faltas';
      this.snackBarService.open(msg);
    } finally {
      this.isSubmitting = false;
    }
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