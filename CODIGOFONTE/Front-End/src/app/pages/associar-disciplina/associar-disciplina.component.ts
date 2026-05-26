import {
  Component,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ActivatedRoute } from '@angular/router';

import { RedService } from 'src/app/services/red.service';
import { disciplina } from 'src/app/modelo/disciplina';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

@Component({
  selector: 'app-associar-disciplina',
  templateUrl: './associar-disciplina.component.html',
  styleUrls: ['./associar-disciplina.component.css'],
})
export class AssociarDisciplinaComponent implements OnInit {

  associarDisciplina!: FormGroup;

  disciplinasSelecionadas: any[] = [];
  disciplinas: any[] = [];

  dataSource: any;
  dataSource2: any;

  user: any;

  idRED: any;
  red: any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns = [
    'Sigla',
    'NomeDisciplina',
    'Acoes',
  ];

  constructor(

    private disciplinaservice: DisciplinaService,

    public dialogQuestionService: messageDialog,

    @Optional()
    private dialog: MatDialogRef<AssociarDisciplinaComponent>,

    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: any,

    private snackBarService: SnackBarService,

    private redService: RedService,

    private peeService: PeeService,

    private customPaginatorIntlService:
      CustomPaginatorIntlService,

    private route: ActivatedRoute,

  ) {}

  async ngOnInit() {

    this.associarDisciplina = new FormGroup({

      sigla: new FormControl('', [
        Validators.required,
      ]),

      nomedisciplina: new FormControl('', [
        Validators.required,
      ]),

      checkbox: new FormControl('', [
        Validators.required,
      ]),
    });

    // =========================
    // QUANDO FOR DIALOG
    // =========================

    if (this.data?.red) {

      this.red = this.data.red;

      // veio objeto completo
      if (typeof this.data.red === 'object') {

        this.idRED = this.data.red.idRED;

      }

      // veio apenas id
      else {

        this.idRED = this.data.red;
      }

    }

    // =========================
    // QUANDO FOR TELA NORMAL
    // =========================

    else {

      this.idRED =
        this.route.snapshot.paramMap.get('id');

      if (this.idRED) {

        try {

          const responseRED =
            await this.redService.getRedById(this.idRED);

          this.red = responseRED.data;

        } catch (error) {

          console.error(
            'Erro ao obter RED:',
            error
          );
        }
      }
    }

    console.log('ID RED:', this.idRED);
    console.log('RED:', this.red);

    this.user = localStorage.getItem('user');

    this.user = JSON.parse(this.user);

    this.findAll();
  }

  ngAfterViewInit() {

    this.paginator._intl =
      this.customPaginatorIntlService
        .paginatorIntl;
  }

  async findAll() {

    // TODAS DISCIPLINAS

    const responseDisciplinas =
      await this.disciplinaservice
        .getDisciplina();

    this.disciplinas =
      responseDisciplinas.data.disciplinas;

    // PEEs ASSOCIADOS

    try {

      const responsePees =
        await this.peeService
          .getPeeByIdRED(this.idRED);

      const peesAssociados =
        responsePees.data.pees;

      // IDs das disciplinas associadas

      const disciplinasIdsAssociadas =
        peesAssociados.map(
          (pee: any) =>
            pee.disciplinas_iddisciplinas
        );

      // DISCIPLINAS ASSOCIADAS

      const disciplinasAssociadas =
        this.disciplinas.filter(
          (disciplina) =>
            disciplinasIdsAssociadas.includes(
              disciplina.iddisciplinas
            )
        );

      // TABELA INFERIOR

      this.dataSource2 =
        new MatTableDataSource<disciplina>(
          disciplinasAssociadas
        );

      // REMOVE AS ASSOCIADAS DA LISTA SUPERIOR

      this.disciplinas =
        this.disciplinas.filter(
          (disciplina) =>
            !disciplinasIdsAssociadas.includes(
              disciplina.iddisciplinas
            )
        );

      // TABELA SUPERIOR

      this.dataSource =
        new MatTableDataSource<disciplina>(
          this.disciplinas
        );

    } catch (error: any) {

      console.error(
        'Erro ao obter PEEs associados:',
        error
      );
    }
  }

  applyFilter(data: Event) {

    const value =
      (data.target as HTMLInputElement).value;

    this.dataSource.filter = value;
  }

  selecionarDisciplina(disciplina: any) {

    const disciplinaExistenteIndex =
      this.disciplinasSelecionadas.findIndex(

        (disciplinaSelecionada) =>

          disciplinaSelecionada
            .iddisciplinas ===
          disciplina.iddisciplinas
      );

    if (disciplinaExistenteIndex === -1) {

      this.disciplinasSelecionadas.push(
        disciplina
      );

      // adiciona na tabela inferior

      this.dataSource2.data.push(
        disciplina
      );

      this.dataSource2
        ._updateChangeSubscription();

      // remove da superior

      const index =
        this.disciplinas.findIndex(

          (item) =>
            item.iddisciplinas ===
            disciplina.iddisciplinas
        );

      if (index >= 0) {

        this.disciplinas.splice(index, 1);

        this.dataSource =
          new MatTableDataSource<disciplina>(
            this.disciplinas
          );
      }

    } else {

      this.snackBarService.open(
        'Esta disciplina já foi associada'
      );
    }
  }

  async removerDisciplina(disciplina: any) {

    const index =
      this.disciplinasSelecionadas.findIndex(

        (item) =>
          item.iddisciplinas ===
          disciplina.iddisciplinas
      );

    // DISCIPLINA NOVA

    if (index >= 0) {

      this.disciplinasSelecionadas.splice(
        index,
        1
      );

      // remove da tabela inferior

      this.dataSource2.data =
        this.dataSource2.data.filter(

          (item: any) =>
            item.iddisciplinas !==
            disciplina.iddisciplinas
        );

      // devolve para tabela superior

      this.disciplinas.push(disciplina);

      this.dataSource.data = [
        ...this.disciplinas,
      ];
    }

    // DISCIPLINA JÁ EXISTENTE

    else {

      const peeComDisciplina =
        this.red?.pee?.find(

          (pee: any) =>

            pee.disciplinas_iddisciplinas ===
            disciplina.iddisciplinas
        );

      const removerDisciplina =
        await this.dialogQuestionService
          .openDialogRemoveDisciplina();

      if (removerDisciplina === false) {
        return;
      }

      if (
        peeComDisciplina?.situacao !==
        'Aguardando Associação de Professor'
      ) {

        console.log(
          'Status:',
          peeComDisciplina?.situacao
        );

        this.snackBarService.open(
          'Não é possível remover disciplinas pois já possui um professor associado'
        );

        return;
      }

      if (peeComDisciplina) {

        try {

          await this.peeService.deletePee(
            peeComDisciplina.idpee
          );

          // remove da tabela inferior

          this.dataSource2.data =
            this.dataSource2.data.filter(

              (item: any) =>
                item.iddisciplinas !==
                disciplina.iddisciplinas
            );

          // devolve para superior

          this.disciplinas.push(disciplina);

          this.dataSource.data = [
            ...this.disciplinas,
          ];

        } catch (error: any) {

          console.error(
            'Erro ao remover PEE:',
            error
          );
        }
      }
    }
  }

  async cadastrar() {

    try {

      for (const item of this.disciplinasSelecionadas) {

        await this.peeService.createPee({

          conteudo: '',

          metodologia: '',

          trabalhos: '',

          bibliografia: '',

          criterios: '',

          prazofinal: new Date(),

          RED_idRED: this.idRED,

          disciplinas_iddisciplinas:
            item.iddisciplinas,

          pee_servidor: null,

          percentualabono: -1,

          situacao:
            'Aguardando Associação de Professor',
        });
      }

      // altera situação RED

      try {

        await this.redService
          .updateSituacaoRED({

            idRED: this.idRED,

            situacao: 'Em andamento',
          });

      } catch (error: any) {

        if (error?.error?.data) {

          this.snackBarService.open(

            `Falha ao alterar situação da RED: ${error.error.data}`
          );

        } else {

          this.snackBarService.open(
            'Falha ao alterar situação da RED'
          );
        }
      }

      this.snackBarService.open(
        'Disciplinas associadas com sucesso!!'
      );

      // fecha dialog se existir

      this.dialog?.close(true);

    } catch (error: any) {

      if (error?.error?.data) {

        this.snackBarService.open(

          `Falha ao associar Disciplina: ${error.error.data}`
        );

      } else {

        this.snackBarService.open(
          'Falha ao associar Disciplina'
        );
      }
    }
  }

  cancelar() {

    this.dialog?.close();
  }

  apresentarAluno() {

    if (!this.red?.aluno) {
      return '';
    }

    return `Aluno: ${this.red.aluno.nome} - ${this.red.aluno.prontuario}`;
  }
}