import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { pee } from 'src/app/modelo/pee';
import { PeeService } from 'src/app/services/pee.service';
import { RedService } from 'src/app/services/red.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssociarProfessoresComponent } from 'src/app/modulos/associacoes/associar-professores/associar-professores.component';

export interface curso {
  idcurso: number;
  sigla: string;
}

export interface red {
  idRED: number;
  dataInicioProcesso: Date;
  dataPrevisaoTermino: Date;
  motivoAfastamento: String;
  situacao: String;
  coordenador: number;
  aluno_id: number;
  observacao: String;
  inicioAfastamento: Date;
  tempoAfastamento: number;
  semestreOuAnoAluno: number;
}

@Component({
  selector: 'app-home-coordenador',
  templateUrl: './home-coordenador.component.html',
  styleUrls: ['./home-coordenador.component.css'],
})
export class HomeCoordenadorComponent implements OnInit {

  user: any = '';

  // 🔵 PEE
  pees: pee[] = [];
  peesProfessor: pee[] = [];
  aguardandoProfessor: any[] = [];

  // 🔴 RED
  reds: any[] = [];
  esperandoConfirmacao: any[] = [];
  ativos: any[] = [];

  // 🔢 DATASOURCE
  dataSourceRed!: MatTableDataSource<any>;
  dataSourceRedAtivos!: MatTableDataSource<any>;
  dataSourceAguardando!: MatTableDataSource<any>;

  // 📊 COLUNAS
  displayedColumnsRED = [
    'NomeRED',
    'ProntuarioRED',
    'CursoRED',
    'InicioRED',
    'TempoAfastamentoRED',
    'TerminoRED',
    'SituacaoRED',
    'SituacaoPEE',
  ];

  displayedColumnsREDAtivos = [
    'NomeRED',
    'ProntuarioRED',
    'CursoRED',
    'InicioRED',
    'TempoAfastamentoRED',
    'TerminoRED',
  ];

  displayedColumnsPEE = [
    'Disciplina',
    'Nome',
    'Prontuario',
    'Email',
    'Situacao',
    'Acoes',
  ];

  constructor(
    private redService: RedService,
    private peeService: PeeService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.findAllRED();
    this.findAllPEE();
  }

  // =========================
  // RED
  // =========================

  async findAllRED() {
    const response = await this.redService.getRed();
    this.reds = response.data.reds;

    this.esperandoConfirmacao = this.reds.filter(
      (red) =>
        red.situacao === 'Esperando confirmação' &&
        red.coordenador == this.user.idservidor
    );

    this.ativos = this.reds.filter(
      (red) =>
        red.coordenador == this.user.idservidor &&
        red.situacao === 'Em andamento'
    );

    this.dataSourceRed = new MatTableDataSource(this.esperandoConfirmacao);
    this.dataSourceRedAtivos = new MatTableDataSource(this.ativos);
  }

  // =========================
  // PEE
  // =========================

  async findAllPEE() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;

    // 🔔 PEEs para alerta
    this.peesProfessor = this.pees.filter(
      (pee: any) =>
        pee.pee_servidor &&
        pee.pee_servidor.some(
          (item: any) => item.servidorId === this.user.idservidor
        ) &&
        pee.percentualabono == -1.0 &&
        (pee.situacao === 'Enviado para o aluno' ||
          pee.situacao === 'Aguardando Preenchimento')
    );

    // 👨‍🏫 PEEs aguardando professor
    this.aguardandoProfessor = this.pees.filter(
      (pee) => pee.situacao === 'Aguardando Associação de Professor'
    );

    this.dataSourceAguardando = new MatTableDataSource(
      this.aguardandoProfessor
    );
  }

  // =========================
  // UTIL
  // =========================

  formatData(data: Date): string {
    return data ? new Date(data).toLocaleDateString('pt-BR') : '';
  }

  situacaoPEEs(pee: any[]): string {
    if (!pee || pee.length === 0) return 'Sem PEE';
    return 'Com PEE';
  }

  // =========================
  // AÇÕES
  // =========================

  formularioRED(visualizar: boolean, red: any) {
    console.log(red);
  }

  preencherAvaliarPEE(): boolean {
    return this.peesProfessor && this.peesProfessor.length > 0;
  }

  listarPEEs(): void {
    this.router.navigate([`/${this.user.tiposervidor}/listarPEEs`]);
  }

  // ✅ MÉTODO QUE FALTAVA (corrige erro do botão)
  associarProfessor(pee: pee): void {

  const dialogRef = this.dialog.open(
    AssociarProfessoresComponent,
    {
      width: '1000px',
      autoFocus: false,
      disableClose: true,

      data: {
        idRED: pee.RED_idRED,
        idPEE: pee.idpee,
        servidor_idservidor: pee.servidor_idservidor,
        pee: pee
      }
    }
  );

  dialogRef.afterClosed().subscribe((result: any) => {

    console.log('Dialog fechado');

    this.findAllRED();
    this.findAllPEE();

  });

}

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAllRED();
      this.findAllPEE();
    });
  }
}