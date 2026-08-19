import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-orientacao-pedagogica',
  templateUrl: './dialog-orientacao-pedagogica.component.html',
  styleUrls: ['./dialog-orientacao-pedagogica.component.css']
})
export class DialogOrientacaoPedagogicaComponent implements AfterViewInit {

  @ViewChild('orientacaoInput')
  orientacaoInput!: ElementRef<HTMLTextAreaElement>;

  orientacao = '';
  textoPadrao = '';

  constructor(
    public dialogRef: MatDialogRef<DialogOrientacaoPedagogicaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {

    this.textoPadrao = `Prezado Coordenador.

O aluno ${data.nomeAluno} apresentou solicitação de Regime de Exercício Domiciliar - RED, para o período de ${this.formatarData(data.inicioAfastamento)} a ${this.formatarData(data.dataFim)}, perfazendo ${data.diasAfastamento} dias de afastamento.

No IFSP, o RED está amparado pelas seguintes normativas:

Lei 9.394/1996, que estabelece a Lei de Diretrizes e Bases da Educação Nacional;
Portaria IFSP nº 778/2013, que aprova o Regime de Exercícios Domiciliares;
Resolução IFSP nº 147/2016, que aprova a Organização Didática para os cursos superiores;
Resolução IFSP nº 062/2018, que aprova a Organização Didática para os cursos da Educação Básica;
Portaria IFSP nº 620/2022, que versa sobre a retomada das atividades presenciais;
Instrução Normativa IFSP PRE nº 12/2022, sobre procedimentos de retorno presencial.

Inicialmente, salientamos que o RED possibilita ao aluno "estudos em sua residência" durante o período de afastamento. As atividades de estudo propostas ao aluno não têm caráter avaliativo. Assim, avaliações ocorridas neste período de afastamento deverão ser aplicadas somente quando de seu retorno às atividades letivas (após o encerramento do afastamento) e dentro do prazo de 30 dias, para a conclusão do RED.

Quanto ao abono de faltas, a ação será processada pela Coordenadoria de Registros Acadêmicos, conforme indicação dos respectivos componentes curriculares. Ao docente cabe lançar em seu diário as "faltas" nos respectivos dias referentes ao período de afastamento.

Vimos solicitar a atenção quanto ao cumprimento de algumas etapas a serem seguidas pela coordenação do curso, professores e aluno, para que este tenha acesso ao desenvolvimento de seus estudos e das atividades referentes a este período de afastamento.

Salientamos, ainda, a importância quanto aos prazos estipulados para que o aluno não seja prejudicado com acúmulo de estudos quando de seu retorno às atividades letivas.

Quanto aos componentes curriculares de ordem meramente prática, salientamos a possibilidade de se fornecer ao aluno material de estudos equivalente ao planejado para o período do afastamento. Caso haja indeferimento, o docente deverá dar suporte adequado ao aluno quando do seu retorno às aulas quanto ao conteúdo do período de afastamento, bem como orientamos que seja apresentada a justificativa no "cabeçalho" do Programa de Estudos.`;

    this.orientacao =
      data?.orientacaoPedagogica?.trim()
        ? data.orientacaoPedagogica
        : this.textoPadrao;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const textarea = this.orientacaoInput.nativeElement;

      // posiciona o cursor e o scroll no início
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      textarea.scrollTop = 0;
    });
  }

  formatarData(data: string | Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  salvar() {
    if (!this.orientacao.trim()) {
      return;
    }

    this.dialogRef.close(this.orientacao.trim());
  }
}