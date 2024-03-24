import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//
import { PeeService } from 'src/app/services/pee.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-abonar-falta',
  templateUrl: './abonar-falta.component.html',
  styleUrls: ['./abonar-falta.component.css'],
})
export class AbonarFaltaComponent implements OnInit {
  abonarFaltaPee!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AbonarFaltaComponent>,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.abonarFaltaPee = new FormGroup({
      descricao: new FormControl('', [Validators.required]),
      entregaAluno: new FormControl('', [Validators.required]),
      cumprimento: new FormControl('', [Validators.required]),
      novaAtividade: new FormControl('', [Validators.required]),
      percentualAbono: new FormControl('', [Validators.required]),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.abonarFaltaPee.invalid || this.isSubmitting) {
      this.openSnackBar('Campos Obrigatórios', null);
      return;
    } else {
      this.isSubmitting = true;
      try {
        console.log(this.cumprimento);
        console.log(this.novaAtividade);
        await this.peeService.createAtividade({
          descricao: this.descricao,
          prazoatividade: this.data.prazofinal,
          pee_idpee: this.data.idpee,
          dateEntregaAluno: this.entregaAluno,
          cumpriuAtividade: this.cumprimento,
          novaAtividade: this.novaAtividade,
        });

        await this.peeService.updatePee({
          idpee: this.data.idpee,
          conteudo: this.data.conteudo,
          metodologia: this.data.metodologia,
          trabalhos: this.data.trabalhos,
          bibliografia: this.data.bibliografia,
          criterios: this.data.exigencia,
          prazofinal: this.data.prazofinal,
          RED_idRED: this.data.RED_idRED,
          disciplinas_iddisciplinas: this.data.disciplinas_iddisciplinas,
          servidor_idservidor: this.data.servidor_idservidor,
          percentualabono: this.percentualAbono,
          dataEnvioProposta: this.data.dataEnvioProposta,
          canalComunicacao: this.data.canalComunicacao,
          houveAvaliacao: this.data.houveAvaliacao,
          avaliacoesRealizadas: this.data.avaliacoesRealizadas,
          dataAvaliacao: this.data.dataAvaliacao,
          observacao: this.data.observacao,
        });
        this.openSnackBar('Faltas abonadas com sucesso!!', null);
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.openSnackBar('Falha ao abonar as Faltas', errorMessage);
        } else {
          this.openSnackBar(
            'Falha ao abonar as Faltas',
            'Ocorreu um erro durante o abono das faltas.'
          );
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
      duration: 3000,
    });
  }

  cancelar() {
    this.dialog.close();
  }

  get descricao() {
    return this.abonarFaltaPee.get('descricao')!.value;
  }

  get entregaAluno() {
    return this.abonarFaltaPee.get('entregaAluno')!.value;
  }

  get cumprimento() {
    return this.abonarFaltaPee.get('cumprimento')!.value;
  }

  get novaAtividade() {
    return this.abonarFaltaPee.get('novaAtividade')!.value;
  }

  get percentualAbono() {
    return this.abonarFaltaPee.get('percentualAbono')!.value;
  }
}
