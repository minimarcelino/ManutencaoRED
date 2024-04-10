import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-cadastrar-pee',
  templateUrl: './cadastrar-pee.component.html',
  styleUrls: ['./cadastrar-pee.component.css'],
})
export class CadastrarPEEComponent implements OnInit {
  cadastrarPee!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<CadastrarPEEComponent>,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackBarService: SnackBarService,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.cadastrarPee = new FormGroup({
      conteudo: new FormControl('', [
        Validators.required,
        Validators.maxLength(4000),
      ]),
      metodologia: new FormControl('', [
        Validators.required,
        Validators.maxLength(4000),
      ]),
      trabalhos: new FormControl('', [
        Validators.required,
        Validators.maxLength(2000),
      ]),
      bibliografia: new FormControl('', [
        Validators.required,
        Validators.maxLength(2000),
      ]),
      exigencia: new FormControl('', [
        Validators.required,
        Validators.maxLength(2000),
      ]),
      prazo: new FormControl('', [Validators.required]),
      contato: new FormControl(this.data.emailServidor, [Validators.required]),
      comunicacao: new FormControl(null),
      observacao: new FormControl('', [Validators.maxLength(4000)]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.conteudo.trim() === '') {
      this.snackBarService.open('Conteúdos deve ser preenchido corretamente.');
      return;
    }

    if (this.metodologia.trim() === '') {
      this.snackBarService.open('Metodologia deve ser preenchido corretamente.');
      return;
    }

    if (this.trabalhos.trim() === '') {
      this.snackBarService.open('Trabalhos deve ser preenchido corretamente.');
      return;
    }

    if (this.bibliografia.trim() === '') {
      this.snackBarService.open('Indicações bibliográficas deve ser preenchido corretamente.');
      return;
    }

    if (this.exigencia.trim() === '') {
      this.snackBarService.open('Critérios de exigência deve ser preenchido corretamente.');
      return;
    }

    const dataAtual = new Date();
    const prazoSelecionado = new Date(this.prazo);
    if (this.cadastrarPee.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos Obrigatórios');
      return;
    }
    if (prazoSelecionado < dataAtual) {
      this.snackBarService.open('A data deve ser posterior à data atual');
      return;
    } else {
      this.isSubmitting = true;
      try {
        await this.peeService.updateWithEmail({
          idpee: this.data.idpee,
          conteudo: this.conteudo,
          metodologia: this.metodologia,
          trabalhos: this.trabalhos,
          bibliografia: this.bibliografia,
          criterios: this.exigencia,
          prazofinal: this.prazo,
          RED_idRED: this.data.RED_idRED,
          disciplinas_iddisciplinas: this.data.disciplinas_iddisciplinas,
          servidor_idservidor: this.data.servidor_idservidor,
          percentualabono: this.data.percentualabono,
          dataEnvioProposta: new Date(),
          canalComunicacao: this.comunicacao,
          observacao: this.observacao,
        });
        this.snackBarService.open('PEE cadastrado com sucesso!!');
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.snackBarService.open(`Falha ao cadastrar PEE: ${errorMessage}`);
        } else {
          this.snackBarService.open('Falha ao cadastrar Pee');
        }
      }
    }
  }

  cancelar() {
    this.dialog.close();
  }

  updateCharacterCount(campoTexto: string, limite: number): number {
    return limite - campoTexto.length;
  }

  get conteudo() {
    return this.cadastrarPee.get('conteudo')!.value;
  }

  get metodologia() {
    return this.cadastrarPee.get('metodologia')!.value;
  }

  get trabalhos() {
    return this.cadastrarPee.get('trabalhos')!.value;
  }

  get bibliografia() {
    return this.cadastrarPee.get('bibliografia')!.value;
  }

  get exigencia() {
    return this.cadastrarPee.get('exigencia')!.value;
  }

  get prazo() {
    return this.cadastrarPee.get('prazo')!.value;
  }

  get contato() {
    return this.cadastrarPee.get('contato')!.value;
  }

  get comunicacao() {
    return this.cadastrarPee.get('comunicacao')!.value || null;
  }

  get avaliacao() {
    return this.cadastrarPee.get('avaliacao')!.value || null;
  }

  get dataAvaliacao() {
    return this.cadastrarPee.get('dataAvaliacao')!.value || null;
  }

  get observacao() {
    return this.cadastrarPee.get('observacao')!.value || null;
  }

  get avaliacaoRealizada() {
    return this.cadastrarPee.get('avaliacaoRealizada')!.value || null;
  }
}
