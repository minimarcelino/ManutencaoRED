import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';
import { AssociarProfessoresComponent } from '../../associacoes/associar-professores/associar-professores.component';
import { DialogOrientacaoPedagogicaComponent } from 'src/app/components/dialog-orientacao-pedagogica/dialog-orientacao-pedagogica.component';
import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-visualizar-disciplina',
  templateUrl: './visualizar-disciplina.component.html',
  styleUrls: ['./visualizar-disciplina.component.css'],
})
export class VisualizarDisciplinaComponent implements OnInit {
  visualizarDisciplina!: FormGroup;
  user: any;
  disciplinas: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Professor',
    'Sigla',
    'NomeDisciplina',
    'Situacao',
    'Acoes',
  ];

  constructor(
    private peeService: PeeService,
    private snackBarService: SnackBarService,
    public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<VisualizarDisciplinaComponent>,
    private dialogProfessor: MatDialog,
    private notificationService: NotificationService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.visualizarDisciplina = new FormGroup({
      professor: new FormControl({ value: this.data.pee, disabled: true }, [
        Validators.required,
      ]),
      sigla: new FormControl({ value: this.data.pee, disabled: true }, [
        Validators.required,
      ]),
      nomedisciplina: new FormControl(
        { value: this.data.motivoAfastamento, disabled: true },
        [Validators.required]
      ),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.disciplinas = this.data.pee;
    this.dataSource = new MatTableDataSource<any>(this.disciplinas);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  cancelar() {
    this.dialog.close();
  }

  verificarSituacao(pee: any): boolean {
    return (
      pee.situacao === 'Aguardando Preenchimento' ||
      pee.situacao === 'Enviado para o aluno'
    );
  }

  async sendEmailProfessor(pee: any) {
  for (const servidor of pee.pee_servidor) {
    try {
      const response = await this.notificationService.sendEmailProfessor(
        servidor.servidorId,
        pee.idpee
      );

      console.log('Resposta:', response);
    } catch (error) {
      console.error('Erro:', error);
    }
  }
}

  peeAguardandoProfessor(pee: any): boolean {
    return pee.situacao === 'Aguardando Associação de Professor';
  }

  associarProfessor(pee: any) {

  const associarProfessor = this.dialogProfessor.open(
    AssociarProfessoresComponent,
    {
      width:'100%',
      height:'95%',
      data: {
        idRED: pee.RED_idRED,
        idPEE: pee.idpee,

        servidores: pee.pee_servidor || [],

        pee: pee,
      },
    }
  );

  this.handleDialogConfirm(associarProfessor);
}

abrirOrientacao(pee: any) {

  const dialog = this.dialogProfessor.open(
    DialogOrientacaoPedagogicaComponent,
    {
      width: '900px',
      maxWidth: '95vw',
      data: {
        idpee: pee.idpee,
        orientacaoPedagogica: pee.orientacaoPedagogica
      }
    }
  );

  dialog.afterClosed().subscribe(async (orientacao) => {

    if (!orientacao) {
      return;
    }

    pee.orientacaoPedagogica = orientacao;

    try {

      await this.peeService.updatePee(pee);

      this.snackBarService.open(
        'Orientação pedagógica salva com sucesso!'
      );

    } catch (error) {

      console.error(error);

      this.snackBarService.open(
        'Erro ao salvar a orientação pedagógica.'
      );

    }

  });

}

  apresentarDocentes(pee: any): string {

  //console.log('DADOS DA LINHA:', pee);

  if (!pee?.pee_servidor || pee.pee_servidor.length === 0) {
    return '-';
  }

  const docentes = pee.pee_servidor
    .filter((docente: any) => docente.servidor)
    .map((docente: any) => docente.servidor.nome);

  return docentes.length > 0
    ? docentes.join(', ')
    : '-';
}

handleDialogConfirm(dialog: any) {

  dialog.afterClosed().subscribe(() => {

    // atualiza a lista sem recarregar a página

  });

}
}
