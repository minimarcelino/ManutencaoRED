import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { alunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { EditarComponent } from '../editar/editar.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { VisualizarAlunoComponent } from '../visualizar/visualizar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarAlunoComponent implements OnInit {

  alunos: aluno[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  user: any;

  displayedColumns = ['prontuario', 'nome', 'telefone', 'email', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private alunoservice: alunoService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async cadastrar() {
    if (this.user.tiposervidor == 'administrador') {
      this.router.navigate(['/admin/cadastrarAluno']);
    } else {
      this.router.navigate(['/cra/cadastrar']);
    }
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }


  async findAll() {
    const response = await this.alunoservice.getAluno();
    this.alunos = response.data.alunos;
    this.dataSource = new MatTableDataSource<aluno>(this.alunos);
    this.dataSource.paginator = this.paginator;
  }

  formatDataNascimento(dataNascimento: Date): string {
    if (dataNascimento) {
      return formatDate(dataNascimento, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }

  async deleteAlunoPermanent(id: number) {
    try {
      let response = await this.alunoservice.deleteAluno(id);
      if (response) {
        this.openSnackBar("Aluno deletado com sucesso!!", null);
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar("Falha ao deletar aluno", errorMessage);
      } else {
        this.openSnackBar("Falha ao deletar aluno", "Ocorreu um erro durante a remoção do aluno.");
      }
    }
  }

  visualizarAluno(aluno: any) {
    const editar =  this.dialog.open( VisualizarAlunoComponent ,{
      data: {id: aluno.id, prontuario: aluno.prontuario, nome: aluno.nome, dataNascimento: aluno.dataNascimento, endereco: aluno.endereco,
        telefone: aluno.telefone, email: aluno.email, curso: aluno.curso}
    });
    this.handleDialogConfirm(editar);
  }

  editarAluno(aluno: any) {
    const editar = this.dialog.open(EditarComponent, {
      data: {
        id: aluno.id, prontuario: aluno.prontuario, nome: aluno.nome, data: aluno.dataNascimento, endereco: aluno.endereco,
        telefone: aluno.telefone, email: aluno.email, curso: aluno.curso
      }
    });
    this.handleDialogConfirm(editar);
  }

  async deleteAluno(aluno: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete('aluno');
    if (res) {
      await this.deleteAlunoPermanent(aluno.id);
    }
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
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
}