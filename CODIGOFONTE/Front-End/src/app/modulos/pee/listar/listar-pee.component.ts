import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
//
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { AbonarFaltaComponent } from '../abonar-faltas/abonar-faltas.component';


@Component({
  selector: 'app-listar-pee',
  templateUrl: './listar-pee.component.html',
  styleUrls: ['./listar-pee.component.css'],
})
export class ListarPEEComponent implements OnInit {
  pees: any[] = [];
  user: any = '';
  filteredPEEs: any[] = [];
  situacaoSelecionada = 'todos';
  situacao = [
  'Aguardando Aceite Docente',
  'Aguardando Preenchimento',
  'Enviada para o Aluno',
  'Avaliado',
];


  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Disciplina',
    'Nome',
    'Prontuario',
    'Email',
    'Professor',
    'Situacao',
    'Abono',
    'Acoes',
  ];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private peeService: PeeService,
    private dialog: MatDialog,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.findAll();
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  async findAll() {
  try {
    //("USER LOGADO:", this.user);
    //console.log("ID SERVIDOR:", this.user?.idservidor);

    const response = await this.peeService.getPeeByProfessor(
      this.user.idservidor
    );

    //console.log("RESPOSTA COMPLETA:", response);

    //console.log("PEES RECEBIDOS:", response.data.pees);
    this.pees = response.data.pees || [];

    this.dataSource = new MatTableDataSource<any>(this.pees);

    // paginator
    this.dataSource.paginator = this.paginator;

    // sorting (se você usar MatSort depois)
    // this.dataSource.sort = this.sort;

    // 🔥 FILTRO PROFISSIONAL
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const situacao = (data.situacao || '').toLowerCase();
      const filtro = (filter || '').toLowerCase();

      if (filtro === 'todos' || !filtro) {
        return true;
      }

      return situacao === filtro;
    };

    // aplica filtro atual (caso já tenha selecionado algo antes do reload)
    this.dataSource.filter = this.situacaoSelecionada || 'todos';

  } catch (error: any) {
    console.error("ERRO NO FINDALL:", error);
  }
}

async aceitarRED(pee:any){

  const confirmar = await this.dialogQuestionService
    .openDialogConfirmAceitarDisciplina();


  if(confirmar){

    try {

      await this.peeService.updatePee({

        idpee: pee.idpee,

        situacao: 'Aguardando Preenchimento'

      });


      this.findAll();


    } catch(error){

      console.error(
        "Erro ao aceitar RED",
        error
      );

    }

  }

}


async recusarRED(pee:any){


  const confirmar = await this.dialogQuestionService
    .openDialogConfirmRecusarDisciplina();



  if(confirmar){


    const motivo = await this.dialogQuestionService
      .openDialogMotivoRecusaRED();



    if(!motivo){
      return;
    }



    try {


      await this.peeService.updatePee({

        idpee: pee.idpee,

        situacao: `Recusado: ${motivo}`

      });



      this.findAll();



    } catch(error){

      console.error(
        "Erro ao recusar RED",
        error
      );

    }

  }

}

  abonarFalta(pee: any) {
    const editar = this.dialog.open(AbonarFaltaComponent, {
      width: '700px',
      maxHeight: '90vh',
      autoFocus: false,

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
    this.router.navigate([`/${this.user.tiposervidor}/formularioPEE`], navigationExtras);
  }

  aplicarFiltros() {
  let dados = this.pees;

  if (this.situacaoSelecionada !== 'todos') {
    dados = dados.filter(
      pee => pee.situacao === this.situacaoSelecionada
    );
  }

  this.dataSource = new MatTableDataSource(dados);
  this.dataSource.paginator = this.paginator;
}

  filtroPorSituacao(event: MatSelectChange) {
  this.situacaoSelecionada = event.value;

  this.dataSource.filter = this.situacaoSelecionada;
}

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }

  isEnviada(pee: any) {
  return pee.situacao?.toLowerCase().includes('enviad');
}

  isPreencher(pee: any) {
    return pee.situacao === 'Aguardando Preenchimento';
  }

  apresentarAbono(abono: number) {
    return abono < 0 ? "Não avaliado" : `${abono} %`;
  }
}