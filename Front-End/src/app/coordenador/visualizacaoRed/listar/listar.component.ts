import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { alunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { VisualizarComponent } from '../visualizar/visualizar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarRedComponent implements OnInit{

  alunos: any[] = [];
  reds: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['Prontuário', 'Início RED', 'Tempo Afastamento', 'Previsão Término', 'Situação', 'Ações'];

  constructor(private snackBar: MatSnackBar, private router: Router, public dialogQuestionService: messageDialog, private alunoservice: alunoService,
    private dialog: MatDialog, private redService: redService) {
  }

  ngOnInit(): void {
    this.findAll()
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll(){
    const response = await this.alunoservice.getAluno();
    const response2 = await this.redService.getRed();
    this.alunos = response.data.alunos;
    this.reds = response2.data.reds;

    // novo array de objetos que contém ambos objetos
    const mergedData = this.alunos.map((aluno, index) => {
        return {...aluno, ...this.reds[index]};
    });

    this.dataSource = new MatTableDataSource<any>(mergedData);
    this.dataSource.paginator = this.paginator;
}
  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return ''; 
    }
  }

  visualizarRed(red : any) {
    console.log(red);
    const visualizar =  this.dialog.open(VisualizarComponent, {
      data: {idRED: red.idRED, aluno_prontuario: red.prontuario, nome: red.nome, dataInicioProcesso: red.dataInicioProcesso,
             dataPrevisaoTermino: red.dataPrevisaoTermino, motivoAfastamento: red.motivoAfastamento, situacao: red.situacao,
             coordenador: red.coordenador, aluno_id: red.aluno_id, inicioAfastamento: red.inicioAfastamento, observacao: red.observacao,
             tempoAfastamento: red.tempoAfastamento, semestreOuAnoAluno: red.semestreOuAnoAluno}
    });
    this.handleDialogConfirm(visualizar);
  }

  handleDialogConfirm(dialog: any){
    dialog.afterClosed().subscribe((result: string) => {
        this.findAll();
    });
  }

}
