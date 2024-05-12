import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
//
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { AbonarFaltaComponent } from '../abonar-faltas/abonar-faltas.component';
import { MatSelectChange } from '@angular/material/select';



@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarPEEComponent implements OnInit {
  pees: pee[] = [];
  user: any = '';
  filteredPEEs: any[] = [];
  situacaoSelecionada = 'todos';
  situacao = [
    'Aguardando Preenchimento',
    'Enviada ao Aluno',
    'Avaliado',
  ];


  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Disciplina',
    'Nome',
    'Prontuario',
    'Email',
    'Situacao',
    'Abono',
    'Acoes',
  ];

  constructor(
    private router: Router,
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
    this.pees = this.pees.filter(
      (pee) => pee.servidor_idservidor == this.user.idservidor
    );
    //this.pees = this.pees.filter((pee) => pee.percentualabono == -1.0);
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees);
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

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
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

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }

  isEnviada(pee: any) {
    return pee.situacao === 'Enviado para o aluno';
  }

  isPreencher(pee: any){
    return pee.situacao === 'Aguardando Preenchimento';
  }

  apresentarAbono(abono: number){
    return abono < 0 ? "Não avaliado" : `${abono} %`;
  }
}
