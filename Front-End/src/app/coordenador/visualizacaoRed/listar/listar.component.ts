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

  async updateRed(red: any, situacao: String) {
    try {
      await this.redService.updateRed({
        idRED: red.idRED,
        aluno_prontuario: red.aluno_prontuario,
        data_inicio_processo: red.data_inicio_processo,
        dataInicioRed: new Date(),
        dataLimitePee: new Date(),
        dataPrevisaoTermino: red.dataPrevisaoTermino,
        motivoAfastamento: red.motivoAfastamento,
        situacao: situacao,
        coordenador: red.coordenador,
        aluno_id: red.aluno_id
      }); 
      this.openSnackBar("RED alterado com sucesso!!", null);
      this.findAll();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar("Falha ao alterar o RED", errorMessage);
      } else {
        this.openSnackBar("Falha ao alterar o RED", "Ocorreu um erro durante a edição do RED.");
      }
    }
  }

  openSnackBar(message: string, error: string | Error | null) {
    let data;
    if (error === null) {
      data = { message };
    } else if (typeof error === 'string') {
      data = { message: error };
    } else if (error instanceof Error) {
      data = { message: error.message };
    }
    
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: data,
      duration: 3000
    });
  }

  confirmarRed(red : any) {
    this.updateRed(red, "Em andamento");
  }

  recusarRed(red : any) {
    this.updateRed(red, "Recusado");
  }

}
