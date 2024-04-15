import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { formatDate } from '@angular/common';

//
import { PeeService } from 'src/app/services/pee.service';
import { red } from 'src/app/modelo/red';
import { pee } from 'src/app/modelo/pee';
import { AssociarProfessoresComponent } from 'src/app/niveis-acesso/coordenador/associar-professores/associar-professores.component';
import { GerenciarVisualizarPeeComponent } from './gerenciar-visualizar/gerenciar-visualizar.component';



@Component({
  selector: 'app-pee',
  templateUrl: './gerenciar-pee.component.html',
  styleUrls: ['./gerenciar-pee.component.css'],
})
export class GerenciarPEEComponent implements OnInit {
  pees: any[] = [];
  disciplinas: any[] = [];
  reds: red[] = [];
  user: any;
  alunos: any[] = [];
  filteredPEEs: any[] = [];
  situacaoSelecionada = 'todos';
  situacao = [
    'Sem Associação',
    'Associado',
  ];

  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'professor',
    'aluno',
    'email',
    'disciplina',
    'situacao',
    'Ações',
  ];

  constructor(
    public dialogQuestionService: messageDialog,
    private peeService: PeeService,
    private dialog: MatDialog  ) {}

  ngOnInit() {
    this.findAll();
  }

  async findAll() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees);
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }

  associarProfessor(pee: pee) {
    const editar = this.dialog.open(AssociarProfessoresComponent, {
      data: {
        idRED: pee.RED_idRED,
        idPEE: pee.idpee,
        servidor_idservidor: pee.servidor_idservidor,
      },
    });
    this.handleDialogConfirm(editar);
  }

  visualizarPEE(pee: any) {
    const visualizar = this.dialog.open(GerenciarVisualizarPeeComponent, {
      data: {
        aluno_prontuario: pee.red.aluno.prontuario,
        nome: pee.red.aluno.nome,
        conteudo: pee.conteudo,
        metodologia: pee.metodologia,
        trabalhos: pee.trabalhos,
        bibliografia: pee.bibliografia,
        criterios: pee.criterios,
        prazofinal: pee.prazofinal,
        percentualabono: pee.percentualabono,
        dataEnvioProposta: pee.dataEnvioProposta,
        canalComunicacao: pee.canalComunicacao,
        observacoes: pee.observacoes,
        situacao: pee.situacao
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  aplicarFiltros() {
    // Aplica os filtros de curso e situação simultaneamente
    this.filteredPEEs = this.pees.filter(
      (pee) =>
        (this.situacaoSelecionada === 'todos' ||
          pee.situacao === this.situacaoSelecionada)
    );

    // Atualiza o dataSource com os REDs filtrados
    this.dataSource = new MatTableDataSource<any>(this.filteredPEEs);
    this.dataSource.paginator = this.paginator;
  }

  filtroPorSituacao(event: MatSelectChange) {
    // Atualiza o filtro de situação e aplica todos os filtros novamente
    this.situacaoSelecionada = event.value;
    this.aplicarFiltros();
  }

  pesquisar(data: Event) {
    console.log(this.dataSource);

    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }


  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}
