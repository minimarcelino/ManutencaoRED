import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-visualizar-pee',
  templateUrl: './gerenciar-visualizar.component.html',
  styleUrls: ['./gerenciar-visualizar.component.css'],
})
export class GerenciarVisualizarPeeComponent implements OnInit {
  constructor(
    public dialogQuestionService: messageDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<GerenciarVisualizarPeeComponent>,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  visualizarPEE!: FormGroup;
  user: any;
  alunos: any[] = [];
  pees: any[] = [];
  filtredCursos: any[] = [];
  isDisable: boolean = false;

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
    this.visualizarPEE = new FormGroup({
      prontuario: new FormControl(
        {
          value: this.data.nome + ' - ' + this.data.aluno_prontuario,
          disabled: true,
        },
        [Validators.required]
      ),
      conteudo: new FormControl({ value: this.data.conteudo, disabled: true }, [
        Validators.required,
      ]),
      metodologia: new FormControl(
        { value: this.data.metodologia, disabled: true },
        [Validators.required]
      ),
      trabalhos: new FormControl(
        { value: this.data.trabalhos, disabled: true },
        [Validators.required]
      ),
      bibliografia: new FormControl(
        { value: this.data.bibliografia, disabled: true },
        [Validators.required]
      ),
      criterios: new FormControl(
        { value: this.data.criterios, disabled: true },
        [Validators.required]
      ),
      prazofinal: new FormControl(
        { value: this.data.prazofinal, disabled: true },
        [Validators.required]
      ),
      percentualabono: new FormControl(
        { value: this.data.percentual, disabled: true },
        [Validators.required]
      ),
      dataEnvioProposta: new FormControl(
        { value: this.data.dataEnvioProposta, disabled: true },
        [Validators.required]
      ),
      canalComunicacao: new FormControl(
        { value: this.data.canalComunicacao, disabled: true },
        [Validators.required]
      ),
      observacoes: new FormControl(
        { value: this.data.observacoes, disabled: true },
        [Validators.required]
      ),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  cancelar() {
    this.dialog.close();
  }
}
