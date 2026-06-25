import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router, NavigationExtras } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

import { red } from 'src/app/modelo/red';
import { pee } from 'src/app/modelo/pee';
import { servidor } from 'src/app/modelo/servidor';

import { AssociarProfessoresComponent } from '../../associacoes/associar-professores/associar-professores.component';

@Component({
  selector: 'app-gerenciar-pee',
  templateUrl: './gerenciar-pee.component.html',
  styleUrls: ['./gerenciar-pee.component.css'],
})
export class GerenciarPEEComponent implements OnInit {

  pees: any[] = [];
  disciplinas: any[] = [];
  reds: red[] = [];
  alunos: any[] = [];

  filteredPEEs: any[] = [];

  user: any;

  situacaoSelecionada = 'todos';
  professorSelecionado = 'todos';

  professores: servidor[] = [];

  situacao = [
    'Aguardando Associação de Professor',
    'Aguardando Preenchimento',
    'Enviada para o Aluno',
    'Avaliado',
  ];

  dataSource = new MatTableDataSource<any>([]);

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
    public dialogQuestionService: messageDialog,
    private peeService: PeeService,
    private dialog: MatDialog,
    private customPaginatorIntlService: CustomPaginatorIntlService
  ) { }

  ngOnInit(): void {

    this.user = localStorage.getItem('user');

    if (this.user) {
      this.user = JSON.parse(this.user);
    }

    this.findAll();
  }

  ngAfterViewInit(): void {

    if (this.paginator) {
      this.paginator._intl =
        this.customPaginatorIntlService.paginatorIntl;
    }
  }

  async findAll(): Promise<void> {

    try {

      const response = await this.peeService.getPee();

      this.pees = response.data.pees || [];

      console.log('PEEs:', this.pees);

      this.dataSource = new MatTableDataSource<any>(this.pees);

      this.dataSource.filterPredicate = (data: any, filter: string) => {

        const dadosPEE = `
    ${data.red?.aluno?.nome}
    ${data.red?.aluno?.prontuario}
    ${data.red?.aluno?.email}
    ${data.disciplinas?.sigla}
    ${data.situacao}
    ${this.apresentarDocentes(data)}
  `.toLowerCase();

        return dadosPEE.includes(filter);

      };

      this.dataSource.paginator = this.paginator;

      // 🔥 LISTA DE PROFESSORES ÚNICOS
      const uniqueProfessores = new Map<number, servidor>();

      this.pees.forEach((pee: any) => {

        if (pee?.pee_servidor?.length > 0) {

          pee.pee_servidor.forEach((item: any) => {

            const professor = item.servidor;

            if (professor?.idservidor) {

              uniqueProfessores.set(
                professor.idservidor,
                professor
              );
            }
          });
        }
      });

      this.professores = Array.from(uniqueProfessores.values());

      console.log('Professores:', this.professores);

    } catch (error) {

      console.error('Erro ao buscar PEEs:', error);
    }
  }

  formatData(data: Date): string {

    if (data) {

      return formatDate(
        data,
        'dd/MM/yyyy',
        'pt-BR',
        'UTC'
      );
    }

    return '';
  }

  associarProfessor(pee: any): void {

  console.log('PEE selecionado:', pee);

  const editar = this.dialog.open(
    AssociarProfessoresComponent,
    {
      width: '1000px',
      autoFocus: false,
      disableClose: true,

      data: {
        idRED: pee?.RED_idRED,
        idPEE: pee?.idpee,

        // pega os professores já associados
        servidores: pee?.pee_servidor || [],

        pee: pee,
      },
    }
  );

  this.handleDialogConfirm(editar);
}

  testar(a: any) {

    console.log(a);

  }

  formularioPEE(pee: any): void {

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

  aplicarFiltros(): void {

    this.filteredPEEs = this.pees.filter((pee: any) => {

      const filtroSituacao =
        this.situacaoSelecionada === 'todos' ||
        pee.situacao === this.situacaoSelecionada;

      return filtroSituacao;
    });

    this.dataSource =
      new MatTableDataSource<any>(this.filteredPEEs);

    this.dataSource.paginator = this.paginator;
  }

  filtroPorSituacao(event: MatSelectChange): void {

    this.situacaoSelecionada = event.value;

    this.aplicarFiltros();
  }

  filroPorProfessor(event: MatSelectChange): void {

    this.professorSelecionado = event.value;

    this.aplicarFiltros();
  }

  pesquisar(event: Event): void {

    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleDialogConfirm(dialog: any): void {

    dialog.afterClosed().subscribe(() => {

      this.findAll();
    });
  }

  peeAguardandoProfessor(pee: any): boolean {

    return (
      pee?.situacao ===
      'Aguardando Associação de Professor'
    );
  }

  peeAguardandoPreenchimento(pee: any): boolean {

    return (
      pee?.situacao ===
      'Aguardando Preenchimento'
    );
  }

  apresentarDocentes(pee: any): string {

    if (!pee?.pee_servidor?.length) {

      return ' - ';
    }

    return pee.pee_servidor
      .map((docente: any) => docente?.servidor?.nome)
      .filter((nome: string) => nome)
      .join(', ');
  }
}