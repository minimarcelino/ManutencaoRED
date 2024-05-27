import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
//
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { AbonarFaltaComponent } from '../../../modulos/pee/abonar-faltas/abonar-faltas.component';
import { NavigationExtras, Router } from '@angular/router';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pees: pee[] = [];
  user: any = '';
  dataSourceAguardando: any;
  dataSourceEnviada: any;
  @ViewChild('paginatorAguardando') paginatorAguardando!: MatPaginator;
  @ViewChild('paginatorEnviada') paginatorEnviada!: MatPaginator;

  displayedColumns = ['Disciplina', 'Nome', 'Prontuario', 'Email','Situacao' ,'Acoes'];

  constructor(
    public dialogQuestionService: messageDialog,
    private peeService: PeeService,
    private dialog: MatDialog,
    private router: Router,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  ngAfterViewInit() {
    this.paginatorAguardando._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  async findAll() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    this.pees = this.pees.filter((pee: any) => pee.pee_servidor.some((item: any) => item.servidorId === this.user.idservidor));
    this.pees = this.pees.filter((pee) => pee.percentualabono == -1.0);

    // Filtrar PEEs com situação "Aguardando Preenchimento"
    const aguardandoPreenchimento = this.pees.filter((pee) => pee.situacao === 'Aguardando Preenchimento');
    this.dataSourceAguardando = new MatTableDataSource<pee>(aguardandoPreenchimento);
    this.dataSourceAguardando.paginator = this.paginatorAguardando;

    // Filtrar PEEs com situação "Enviada ao Aluno"
    const enviadaAoAluno = this.pees.filter((pee) => pee.situacao === 'Enviado para o aluno');
    this.dataSourceEnviada = new MatTableDataSource<pee>(enviadaAoAluno);
    this.dataSourceEnviada.paginator = this.paginatorEnviada;
  }

  abonarFalta(pee: any) {
    const editar = this.dialog.open(AbonarFaltaComponent, {
      data: {
        idpee: pee.idpee,
        RED_idRED: pee.RED_idRED,
        disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
        servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono,
        aluno_prontuario: pee.red.aluno.prontuario,
        nome_aluno: pee.red.aluno.nome,
        prazofinal: pee.prazofinal,
        conteudo: pee.conteudo,
        metodologia: pee.metodologia,
        trabalhos: pee.trabalhos,
        bibliografia: pee.bibliografia,
        criterios: pee.criterios,
        dataEnvioProposta: pee.dataEnvioProposta,
        canalComunicacao: pee.canalComunicacao,
        houveAvaliacao: pee.houveAvaliacao,
        avaliacoesRealizadas: pee.avaliacoesRealizadas,
        dataAvaliacao: pee.dataAvaliacao,
        observacao: pee.observacao,
      },
    });
    this.handleDialogConfirm(editar);
  }

  formularioPEE(pee: any, visualizar: boolean) {
    const navigationExtras: NavigationExtras = {
      state: {
        pee: pee,
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioPEE`],navigationExtras);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }
}
