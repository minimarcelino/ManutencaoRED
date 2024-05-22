import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { aluno } from 'src/app/modelo/aluno';
import { AlunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarAlunoComponent implements OnInit {
  alunos: aluno[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: any;

  displayedColumns = ['Prontuario', 'Nome', 'Telefone', 'Email', 'Acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private alunoservice: AlunoService,
    private snackBarService: SnackBarService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  formularioAluno(visualizar: boolean, aluno: any = null){
    const navigationExtras: NavigationExtras = {
      state: {
        aluno: aluno,
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioAluno`],navigationExtras);
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
        this.snackBarService.open('Aluno deletado com sucesso!!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open('Falha ao deletar aluno', errorMessage);
      } else {
        this.snackBarService.open(
          'Falha ao deletar aluno',
          'Ocorreu um erro durante a remoção do aluno.'
        );
      }
    }
  }

  async deleteAluno(aluno: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete('aluno');
    if (res) {
      await this.deleteAlunoPermanent(aluno.id);
    }
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      this.findAll();
    });
  }
}
