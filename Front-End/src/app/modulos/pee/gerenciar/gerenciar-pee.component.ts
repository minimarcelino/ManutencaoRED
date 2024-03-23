import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { formatDate } from '@angular/common';

//
import { peeService } from 'src/app/services/pee.service';
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

  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'professor',
    'aluno',
    'email',
    'disciplina',
    'concluido',
    'Ações',
  ];

  constructor(
    public dialogQuestionService: messageDialog,
    private peeservice: peeService,
    private dialog: MatDialog  ) {}

  ngOnInit() {
    this.findAll();
  }

  async findAll() {
    const response = await this.peeservice.getPee();
    this.pees = response.data.pees;
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
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
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}
