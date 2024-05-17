import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

  private data: any;
  desabilitar: boolean = false;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.pee;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    console.log(this.data)

    this.formularioPEE = new FormGroup({
      conteudo: new FormControl(
        { value: this.data.conteudo || '', disabled: this.desabilitar },
        [Validators.required, Validators.maxLength(4000)]
      ),
      metodologia: new FormControl(
        { value: this.data.metodologia || '', disabled: this.desabilitar },
        [Validators.required, Validators.maxLength(4000)]
      ),
      trabalhos: new FormControl(
        { value: this.data.trabalhos || '', disabled: this.desabilitar },
        [Validators.required, Validators.maxLength(2000)]
      ),
      bibliografia: new FormControl(
        { value: this.data.bibliografia || '', disabled: this.desabilitar },
        [Validators.required, Validators.maxLength(2000)]
      ),
      exigencia: new FormControl(
        { value: this.data.criterios || '', disabled: this.desabilitar },
        [Validators.required, Validators.maxLength(2000)]
      ),
      prazo: new FormControl(
        { value: this.data.prazofinal || '', disabled: this.desabilitar },
        [Validators.required]
      ),
      comunicacao: new FormControl({
        value: this.data.canalComunicacao || '',
        disabled: this.desabilitar,
      }),
      observacao: new FormControl(
        { value: this.data.observacoes || '', disabled: this.desabilitar },
        [Validators.maxLength(4000)]
      ),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async submit() {
    if (this.formularioPEE.invalid || this.isSubmitting) {
      this.snackBarService.open('Campos obrigatórios!!');
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

    // Verifica se algum campo obrigatório é apenas espaços em branco
    if (this.conteudo.trim() === '') {
      this.snackBarService.open('Conteúdos deve ser preenchido corretamente.');
      const element = document.getElementById('conteudo');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.metodologia.trim() === '') {
      this.snackBarService.open(
        'Metodologia deve ser preenchido corretamente.'
      );
      const element = document.getElementById('metododlogia');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.trabalhos.trim() === '') {
      this.snackBarService.open('Trabalhos deve ser preenchido corretamente.');
      const element = document.getElementById('trabalhos');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.bibliografia.trim() === '') {
      this.snackBarService.open(
        'Indicações bibliográficas deve ser preenchido corretamente.'
      );
      const element = document.getElementById('bibliografia');
      if (element) {
        element.focus();
      }
      return;
    }

    if (this.exigencia.trim() === '') {
      this.snackBarService.open(
        'Critérios de exigência deve ser preenchido corretamente.'
      );
      const element = document.getElementById('exigencia');
      if (element) {
        element.focus();
      }
      return;
    }


    const dataAtual = new Date();
    const prazoSelecionado = new Date(this.prazo);

    if (prazoSelecionado < dataAtual) {
      this.snackBarService.open('A data deve ser posterior à data atual');
      return;
    } else {
      this.isSubmitting = true;
      const peeServidorIds = this.data.pee_servidor.map((item: any) => ({ idservidor: item.servidorId }));

      try {
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
          percentualabono: this.data.percentualabono,
          dataEnvioProposta: new Date(),
          canalComunicacao: this.comunicacao,
          observacoes: this.observacao,
          editando: true,
          situacao: 'Enviado para o aluno',
        });
        this.snackBarService.open('PEE cadastrado com sucesso!!');
        console.log('Após edição', res);

        this.voltar();
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

  voltar() {
    this.location.back();
  }

  updateCharacterCount(campoTexto: string, limite: number): number {
    // Por algum motivo não está pegando o tamanho do texto do campo
    //return limite - campoTexto.length;
    return limite - 0;
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

  titulo() {
    let titulo;
    const situacao = this.data.situacao;
    if (situacao === 'Enviado para o aluno') {
      titulo = 'Edição de ';
    } else if (situacao === 'Aguardando Preenchimento') {
      titulo = 'Preenchimento de ';
    }

    if (this.desabilitar) {
      titulo = 'Visualização de ';
    }

    return titulo;
  }

  editando(){
    return this.data.situacao === 'Enviado para o aluno';
  }

  disciplinaAluno() {
    const disciplina = `Disciplina: ${this.data.disciplinas.nomeDisciplina}`;
    const aluno = `Aluno: ${this.data.red.aluno.nome}`;
    return {disciplina, aluno};
  }
}
