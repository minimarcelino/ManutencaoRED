import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
//
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { AbonarFaltaComponent } from '../../../modulos/pee/abonar-faltas/abonar-faltas.component';
import { VisualizarPEEComponent } from '../../../modulos/pee/visualizar/visualizar.component';
import { CadastrarPEEComponent } from '../../../modulos/pee/cadastrar/cadastrar-pee.component';

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async findAll() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    this.pees = this.pees.filter((pee) => pee.servidor_idservidor == this.user.idservidor);
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

  visualizarPee(pee: any) {
    console.log(pee);
    const editar = this.dialog.open(VisualizarPEEComponent, {
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
        servidor: pee.servidor,
      },
    });
    this.handleDialogConfirm(editar);
  }


  adicionarPee(pee: any) {
    console.log(pee);
    const editar = this.dialog.open(CadastrarPEEComponent, {
      data: {
        idpee: pee.idpee,
        RED_idRED: pee.RED_idRED,
        disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas,
        servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono,
        emailServidor: pee.servidor.email,
      },
    });
    this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }
}
