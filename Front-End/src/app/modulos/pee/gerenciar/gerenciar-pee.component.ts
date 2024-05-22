import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

//
import { PeeService } from 'src/app/services/pee.service';
import { red } from 'src/app/modelo/red';
import { pee } from 'src/app/modelo/pee';
import { servidor } from 'src/app/modelo/servidor';
import { GerenciarVisualizarPeeComponent } from './gerenciar-visualizar/gerenciar-visualizar.component';
import { AssociarProfessoresComponent } from '../../associacoes/associar-professores/associar-professores.component';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

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
  professorSelecionado = 'todos';
  professores: servidor[] = [];
  situacao = [
    'Aguardando Associação de Professor',
    'Aguardando Preenchimento',
    'Enviada ao Aluno',
    'Avaliado',
  ];

  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Aluno',
    'Prontuario',
    'Professor',
    'Disciplina',
    'Situacao',
    'Acoes',
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogQuestionService: messageDialog,
    private peeService: PeeService,
    private dialog: MatDialog,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) {}

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.findAll();
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  async findAll() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;

    // Cria um conjunto para armazenar cursos únicos
    const uniqueProfessores = new Set<number>();
    this.pees.forEach((pee) => {
      if (pee.servidor && pee.servidor.idservidor) {
        uniqueProfessores.add(pee.servidor.idservidor);
      }
    });
    // Converte o conjunto de IDs de curso de volta para um array de cursos
    this.professores = Array.from(uniqueProfessores).map(
      (professorId) =>
        this.pees.find((pee) => pee.servidor.idservidor === professorId)
          ?.servidor
    );

    // Filtra cursos nulos (pode ocorrer se o curso não for encontrado)
    this.professores = this.professores.filter(
      (professor) => professor !== undefined
    );
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
        //disciplina: pee.pee.disciplinas,
        pee: pee,
      },
    });
    this.handleDialogConfirm(editar);
  }

  formularioPEE(pee: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        pee: pee,
        visualizar: true,
      },
    };
    this.router.navigate(
      [`/${this.user.tiposervidor}/formularioPEE`],
      navigationExtras
    );
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
        situacao: pee.situacao,
      },
    });
    this.handleDialogConfirm(visualizar);
  }

  aplicarFiltros() {
    // Aplica os filtros de curso e situação simultaneamente
    this.filteredPEEs = this.pees.filter(
      (pee) =>
        this.situacaoSelecionada === 'todos' ||
        pee.situacao === this.situacaoSelecionada
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

  filroPorProfessor(event: MatSelectChange) {
    // Atualiza o filtro de curso e aplica todos os filtros novamente
    this.professorSelecionado = event.value;
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

  peeAguardandoProfessor(pee: any): boolean {
    return pee.situacao === 'Aguardando Associação de Professor';
  }

  apresentarDocentes(pee: any) {
    return pee.pee_servidor.length > 0
      ? `${pee.pee_servidor.map((docente: any) => docente.nome).join(', ')}`
      : ' - ';
  }
}
