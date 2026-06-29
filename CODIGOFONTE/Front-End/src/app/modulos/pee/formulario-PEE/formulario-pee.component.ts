import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-formulario-pee',
  templateUrl: './formulario-pee.component.html',
  styleUrls: ['./formulario-pee.component.css'],
})
export class FormularioPEEComponent implements OnInit {
  formularioPEE!: FormGroup;
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;

  minDate: Date = new Date();
  private data: any;
  private desabilitar: boolean = false;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private peeService: PeeService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user')!);


    this.activatedRoute.paramMap.subscribe(() => {

      this.data = window.history.state.pee;
      this.desabilitar = window.history.state.visualizar;


      console.log("PEE RECEBIDA:", this.data);


      this.criarFormulario();

    });


    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

  }

  async submit() {

    if (this.formularioPEE.invalid || this.isSubmitting) {

      this.mostrarErrosFormulario();

      const fields = Object.keys(this.formularioPEE.controls);

      const firstInvalidField = fields.find(
        (field) => this.formularioPEE.get(field)!.invalid
      );


      if (firstInvalidField) {

        const element = document.getElementById(firstInvalidField);

        if (element) {
          element.focus();
        }

      }

      return;
    }


    if (this.conteudo.trim() === '') {

      this.snackBarService.open(
        'O conteúdo deve ser preenchido corretamente.'
      );

      document.getElementById('conteudo')?.focus();

      return;
    }


    if (this.metodologia.trim() === '') {

      this.snackBarService.open(
        'A metodologia deve ser preenchida corretamente.'
      );

      document.getElementById('metodologia')?.focus();

      return;
    }


    if (this.trabalhos.trim() === '') {

      this.snackBarService.open(
        'Os trabalhos devem ser preenchidos corretamente.'
      );

      document.getElementById('trabalhos')?.focus();

      return;
    }


    if (this.bibliografia.trim() === '') {

      this.snackBarService.open(
        'As indicações bibliográficas devem ser preenchidas corretamente.'
      );

      document.getElementById('bibliografia')?.focus();

      return;
    }


    if (this.exigencia.trim() === '') {

      this.snackBarService.open(
        'Os critérios de exigência devem ser preenchidos corretamente.'
      );

      document.getElementById('exigencia')?.focus();

      return;
    }


    const dataAtual = new Date();

    const prazoSelecionado = new Date(this.prazo);


    if (prazoSelecionado < dataAtual) {

      this.snackBarService.open(
        'A data deve ser posterior à data atual.'
      );

      document.getElementById('prazo')?.focus();

      return;
    }


    this.isSubmitting = true;


    const peeServidorIds = this.data.pee_servidor.map((item: any) => ({

      idservidor:
        item.servidorId ??
        item.servidor?.idservidor

    }));


    try {


      console.log("VALORES FORM ANTES DO UPDATE:",
        this.formularioPEE.value
      );


      console.log("GETTERS:",
        {
          conteudo: this.conteudo,
          metodologia: this.metodologia,
          trabalhos: this.trabalhos,
          bibliografia: this.bibliografia,
          exigencia: this.exigencia
        });

      const res = await this.peeService.updateWithEmail({

        idpee: this.data.idpee,

        conteudo: this.conteudo,

        metodologia: this.metodologia,

        trabalhos: this.trabalhos,

        bibliografia: this.bibliografia,

        criterios: this.exigencia,

        prazofinal: this.prazo,

        RED_idRED: this.data.RED_idRED,

        disciplinas_iddisciplinas: this.data.disciplinas_iddisciplinas,

        pee_servidor: peeServidorIds,

        dataEnvioProposta: new Date(),

        canalComunicacao: this.comunicacao,

        observacoes: this.observacao,


        situacao: this.avaliado
          ? 'Avaliado'
          : 'Enviado para o aluno',


        avaliacaoAtividade: this.formularioPEE.get('avaliacaoAtividade')?.value || null,


        percentualabono: this.formularioPEE.get('percentualAbono')?.value || null,


        dataEntregaAtividade: this.formularioPEE.get('dataEntrega')?.value || null,


        houveAvaliacao: this.formularioPEE.get('houveAvaliacao')?.value || null,


        avaliacoesRealizadas: this.formularioPEE.get('avaliacoesRealizadas')?.value || null,


        dataAvaliacao: this.formularioPEE.get('dataAvaliacao')?.value || null,

      });


      this.snackBarService.open(
        'PEE cadastrado com sucesso!!'
      );


      console.log('Após edição', res);


      this.retornarParaLista();


    } catch (error: any) {


      console.error(error);


      const errorData = error?.error?.data;


      if (errorData) {

        this.snackBarService.open(
          `Falha ao cadastrar PEE: ${errorData}`
        );


      } else {

        this.snackBarService.open(
          'Falha ao cadastrar PEE'
        );

      }


    } finally {

      this.isSubmitting = false;

    }

  }

  private mostrarErrosFormulario() {

  const campos = this.formularioPEE.controls;


  // CONTEÚDO
  if (campos['conteudo']?.hasError('required')) {

    this.snackBarService.open(
      'O conteúdo a ser estudado é obrigatório.'
    );

    return;
  }


  if (campos['conteudo']?.hasError('maxlength')) {

    this.snackBarService.open(
      'O conteúdo ultrapassou o limite máximo de caracteres.'
    );

    return;
  }




  // METODOLOGIA
  if (campos['metodologia']?.hasError('required')) {

    this.snackBarService.open(
      'A metodologia a ser utilizada é obrigatória.'
    );

    return;
  }


  if (campos['metodologia']?.hasError('maxlength')) {

    this.snackBarService.open(
      'A metodologia ultrapassou o limite máximo de caracteres.'
    );

    return;
  }




  // TRABALHOS
  if (campos['trabalhos']?.hasError('required')) {

    this.snackBarService.open(
      'Os trabalhos a serem cumpridos são obrigatórios.'
    );

    return;
  }


  if (campos['trabalhos']?.hasError('maxlength')) {

    this.snackBarService.open(
      'Os trabalhos ultrapassaram o limite máximo de caracteres.'
    );

    return;
  }




  // BIBLIOGRAFIA
  if (campos['bibliografia']?.hasError('required')) {

    this.snackBarService.open(
      'As indicações bibliográficas são obrigatórias.'
    );

    return;
  }


  if (campos['bibliografia']?.hasError('maxlength')) {

    this.snackBarService.open(
      'A bibliografia ultrapassou o limite máximo de caracteres.'
    );

    return;
  }




  // CRITÉRIOS DE EXIGÊNCIA
  if (campos['exigencia']?.hasError('required')) {

    this.snackBarService.open(
      'Os critérios de exigência são obrigatórios.'
    );

    return;
  }


  if (campos['exigencia']?.hasError('maxlength')) {

    this.snackBarService.open(
      'Os critérios de exigência ultrapassaram o limite máximo de caracteres.'
    );

    return;
  }




  // PRAZO
  if (campos['prazo']?.hasError('required')) {

    this.snackBarService.open(
      'O prazo para execução é obrigatório.'
    );

    return;
  }


  if (campos['prazo']?.hasError('matDatepickerMin')) {

    this.snackBarService.open(
      'Não é permitido selecionar uma data anterior à data atual.'
    );

    return;
  }




  // COMUNICAÇÃO
  if (campos['comunicacao']?.hasError('required')) {

    this.snackBarService.open(
      'O canal de comunicação e contato são obrigatórios.'
    );

    return;
  }




  // OBSERVAÇÃO
  if (campos['observacao']?.hasError('maxlength')) {

    this.snackBarService.open(
      'A observação ultrapassou o limite máximo de caracteres.'
    );

    return;
  }




  // AVALIAÇÃO (quando avaliado)
  if (this.avaliado) {


    if (campos['avaliacaoAtividade']?.hasError('required')) {

      this.snackBarService.open(
        'A descrição da avaliação é obrigatória.'
      );

      return;
    }


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


    if (campos['dataEntrega']?.hasError('required')) {

      this.snackBarService.open(
        'A data de entrega da atividade é obrigatória.'
      );

      return;
    }

  }



  this.snackBarService.open(
    'Verifique os campos preenchidos.'
  );

}

  retornarParaLista() {
    this.location.back();
  }

  updateCharacterCount(campoTexto: string, limite: number): number {
    return limite - (campoTexto ? campoTexto.length : 0);
  }

  get conteudo() {
    return this.formularioPEE.get('conteudo')!.value;
  }

  get metodologia() {
    return this.formularioPEE.get('metodologia')!.value;
  }

  get trabalhos() {
    return this.formularioPEE.get('trabalhos')!.value;
  }

  get bibliografia() {
    return this.formularioPEE.get('bibliografia')!.value;
  }

  get exigencia() {
    return this.formularioPEE.get('exigencia')!.value;
  }

  get prazo() {
    return this.formularioPEE.get('prazo')!.value;
  }

  get comunicacao() {
    return this.formularioPEE.get('comunicacao')!.value || null;
  }

  get avaliacao() {
    return this.formularioPEE.get('avaliacao')!.value || null;
  }

  get dataAvaliacao() {
    return this.formularioPEE.get('dataAvaliacao')!.value || null;
  }

  get observacao() {
    return this.formularioPEE.get('observacao')!.value || null;
  }

  get avaliacaoRealizada() {
    return this.formularioPEE.get('avaliacaoRealizada')!.value || null;
  }

  get editando(): boolean {
    return this.data.situacao === 'Enviado para o aluno';
  }

  get desabilitado() {
    return this.desabilitar;
  }

  get avaliado(): boolean {
    return this.data.situacao === 'Avaliado';
  }

  cabecalho() {
    const situacao = this.data.situacao;
    const docentes = `Docente(s): ${this.data.pee_servidor.length > 0
      ? this.data.pee_servidor
        .map((docente: any) => docente.servidor.nome)
        .join(', ')
      : ' - '
      }`;
    const disciplina = `Disciplina: ${this.data.disciplinas.nomeDisciplina}`;
    const aluno = `Aluno: ${this.data.red.aluno.nome} - ${this.data.red.aluno.prontuario}`;
    let titulo;

    if (situacao === 'Enviado para o aluno') {
      titulo = 'Edição de ';
    } else if (situacao === 'Aguardando Preenchimento') {
      titulo = 'Preenchimento de ';
    }

    if (this.desabilitar) {
      titulo = 'Visualização de ';
    }

    return { titulo, docentes, disciplina, aluno };
  }

  formatData(Data: Date): string {
    if (Data) {
      return formatDate(Data, 'dd/MM/yyyy', 'pt-BR', 'UTC');
    } else {
      return '';
    }
  }

  apresentarAbono(abono: number) {
    return abono < 0 ? 'Não avaliado' : `${abono} %`;
  }

  get avaliacoesRealizadas() {
    return this.formularioPEE.get('avaliacoesRealizadas')!.value || null;
  }

  criarFormulario() {

    this.formularioPEE = new FormGroup({

      conteudo: new FormControl(
        {
          value: this.data?.conteudo || '',
          disabled: this.desabilitar
        },
        [
          Validators.required,
          Validators.maxLength(4000)
        ]
      ),


      metodologia: new FormControl(
        {
          value: this.data?.metodologia || '',
          disabled: this.desabilitar
        },
        [
          Validators.required,
          Validators.maxLength(4000)
        ]
      ),


      trabalhos: new FormControl(
        {
          value: this.data?.trabalhos || '',
          disabled: this.desabilitar
        },
        [
          Validators.required,
          Validators.maxLength(2000)
        ]
      ),


      bibliografia: new FormControl(
        {
          value: this.data?.bibliografia || '',
          disabled: this.desabilitar
        },
        [
          Validators.required,
          Validators.maxLength(2000)
        ]
      ),


      exigencia: new FormControl(
        {
          value: this.data?.criterios || '',
          disabled: this.desabilitar
        }
      ),


      prazo: new FormControl(
        {
          value: this.data?.prazofinal || '',
          disabled: this.desabilitar
        },
        Validators.required
      ),


      comunicacao: new FormControl(
        {
          value: this.data?.canalComunicacao || '',
          disabled: this.desabilitar
        }
      ),


      observacao: new FormControl(
        {
          value: this.data?.observacoes || '',
          disabled: this.desabilitar
        }
      ),


      avaliacaoAtividade: new FormControl(
        {
          value: this.data?.avaliacaoAtividade || '',
          disabled: this.desabilitar
        }
      ),


      percentualAbono: new FormControl(
        {
          value: this.data?.percentualabono ?? '',
          disabled: this.desabilitar
        }
      ),


      dataEntrega: new FormControl(
        {
          value: this.data?.dataEntregaAtividade || '',
          disabled: this.desabilitar
        }
      ),


      cumpriuAtividade: new FormControl(
        {
          value: this.data?.cumpriuAtividade || '',
          disabled: this.desabilitar
        }
      ),


      houveAvaliacao: new FormControl(
        {
          value: this.data?.houveAvaliacao || '',
          disabled: this.desabilitar
        }
      ),


      avaliacoesRealizadas: new FormControl(
        {
          value: this.data?.avaliacoesRealizadas || '',
          disabled: this.desabilitar
        }
      ),


      dataAvaliacao: new FormControl(
        {
          value: this.data?.dataAvaliacao || '',
          disabled: this.desabilitar
        }
      )

    });


    console.log(
      "FORMULÁRIO CRIADO:",
      this.formularioPEE.value
    );

  }

}
