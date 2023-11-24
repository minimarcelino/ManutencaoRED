import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';
import { peeService } from 'src/app/services/pee.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-cadastrar-pee',
  templateUrl: './cadastrar-pee.component.html',
  styleUrls: ['./cadastrar-pee.component.css']
})
export class CadastrarPeeComponent implements OnInit {

  cadastrarPee!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(private snackBar: MatSnackBar, private router: Router, private peeservice: peeService, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<CadastrarPeeComponent>, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string) { }

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.cadastrarPee = new FormGroup({
      conteudo: new FormControl('', [Validators.required]),
      metodologia: new FormControl('', [Validators.required]),
      trabalhos: new FormControl('', [Validators.required]),
      bibliografia: new FormControl('', [Validators.required]),
      exigencia: new FormControl('', [Validators.required]),
      prazo: new FormControl('', [Validators.required]),
      contato: new FormControl('', [Validators.required]),
      comunicacao: new FormControl(null),
      avaliacao: new FormControl(null),
      avaliacaoRealizada: new FormControl(null),
      dataAvaliacao: new FormControl(null),
      observacao: new FormControl(null),
    });
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async submit() {
    const dataAtual = new Date();
    const prazoSelecionado = new Date(this.prazo);
    if (this.cadastrarPee.invalid || this.isSubmitting) {
      this.openSnackBar("Campos Obrigatórios", null);
      return;
    }
    if (prazoSelecionado < dataAtual) {
      this.openSnackBar("A data deve ser posterior à data atual", null);
      return;
    }
    else {
      console.log('entrou aqui 2');
      this.isSubmitting = true;
      try {
        await this.peeservice.updateWithEmail({
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
          dataEnvioProposta: new Date,
          canalComunicacao: this.comunicacao,
          houveAvaliacao: this.avaliacao,
          avaliacoesRealizadas: this.avaliacaoRealizada,
          dataAvaliacao: this.dataAvaliacao,
          observacao: this.observacao,
        });
        this.openSnackBar("PEE cadastrado com sucesso!!", null);
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar("Falha ao cadastrar Pee", errorMessage);
        } else {
          this.openSnackBar("Falha ao cadastrar Pee", "Ocorreu um erro durante o cadastro do Pee.");
        }
      }
    }
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