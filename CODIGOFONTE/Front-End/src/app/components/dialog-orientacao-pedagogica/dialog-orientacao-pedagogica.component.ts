import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-orientacao-pedagogica',
  templateUrl: './dialog-orientacao-pedagogica.component.html',
  styleUrls: ['./dialog-orientacao-pedagogica.component.css']
})
export class DialogOrientacaoPedagogicaComponent {

  orientacao = '';

  textoPadrao = `Prezado(a) docente,

Esta disciplina integra um Plano de Exercícios Domiciliares (PEE).

Solicitamos que sejam observados os conteúdos essenciais da disciplina, as metodologias adequadas ao período de afastamento do estudante e os critérios de avaliação.

Caso necessário, esta orientação poderá ser complementada pela CSP.`;

  constructor(
  public dialogRef: MatDialogRef<DialogOrientacaoPedagogicaComponent>,
  @Inject(MAT_DIALOG_DATA)
  public data: any
) {

  this.orientacao =
    data?.orientacaoPedagogica?.trim()
      ? data.orientacaoPedagogica
      : this.textoPadrao;

}

  salvar() {

  if (!this.orientacao.trim()) {
    return;
  }

  this.dialogRef.close(
    this.orientacao.trim()
  );

}

}