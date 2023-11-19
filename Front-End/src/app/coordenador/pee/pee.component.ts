import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { Router } from '@angular/router';
import { peeService } from 'src/app/services/pee.service';
import { formatDate } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { red } from 'src/app/modelo/red';
import { AssociarProfessoresComponent } from '../associar-professores/associar-professores.component';
import { pee } from 'src/app/modelo/pee';
import { alunoService } from 'src/app/services/alunos.service';
import { VisualizarPeeComponent } from './visualizar-pee/visualizar-pee.component';
@Component({
  selector: 'app-pee',
  templateUrl: './pee.component.html',
  styleUrls: ['./pee.component.css']
})
export class PeeComponent implements OnInit {
  pees: any[] = [];
  disciplinas: any[] = [];
  reds: red[] = [];
  user: any;
  alunos: any[] = [];

  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['aluno', 'email', 'disciplina', 'Ações'];

  constructor(private snackBar: MatSnackBar, private router: Router, public dialogQuestionService: messageDialog,
    private peeservice: peeService, private alunoservice: alunoService, private dialog: MatDialog, private _adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.findAll()

  }

  async findAll() {
    const response = await this.peeservice.getPee();
    this.pees = response.data.pees;
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees)
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
      data: { idRED: pee.RED_idRED, idPEE: pee.idpee, servidor_idservidor: pee.servidor_idservidor }
    });
    this.handleDialogConfirm(editar);
  }

  visualizarPEE(pee: any) {
    const visualizar = this.dialog.open(VisualizarPeeComponent, {
      data: {
        aluno_prontuario: pee.red.aluno.prontuario, nome: pee.red.aluno.nome, conteudo: pee.conteudo, metodologia: pee.metodologia,
        trabalhos: pee.trabalhos, bibliografia: pee.bibliografia, criterios: pee.criterios, prazofinal: pee.prazofinal,
        percentualabono: pee.percentualabono, dataEnvioProposta: pee.dataEnvioProposta, canalComunicacao: pee.canalComunicacao,
        observacoes: pee.observacoes
      }
    });
    this.handleDialogConfirm(visualizar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }

}
