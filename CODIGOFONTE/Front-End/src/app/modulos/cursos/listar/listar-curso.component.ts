import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

import { curso } from '../../../modelo/curso';
import { servidor } from 'src/app/modelo/servidor';
import { messageDialog } from '../../../services/messageDialog.service';
import { CursoService } from 'src/app/services/cursos.service';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';

@Component({
  selector: 'app-listar-curso',
  templateUrl: './listar-curso.component.html',
  styleUrls: ['./listar-curso.component.css'],
})
export class ListarCursosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  items: any[] = [];
  data: any[] = [];
  coordenador: servidor[] = [];
  cursos: curso[] = [];
  dataSource: any;
  user: any;

  displayedColumns = ['NomeCurso', 'Sigla', 'Acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private snackBarService: SnackBarService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
    private entityUpdateService: EntityUpdateService,
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

     // Assine para receber notificações de atualização de cursos
     this.entityUpdateService.getUpdateNotifier('curso').subscribe(() => {
      this.findAll();
    });
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }

  formularioCurso(visualizar: boolean, curso: any = null){
    const navigationExtras: NavigationExtras = {
      state: {
        curso: curso,
        visualizar: visualizar
      },
    };
    this.router.navigate([`/${this.user.tiposervidor}/formularioCurso`],navigationExtras);

  }

  async findAll() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
    this.dataSource = new MatTableDataSource<curso>(this.cursos);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async deleteCursoPermanent(id: number) {
    try {
      let response = await this.cursoService.deleteCurso(id);
      if (response) {
        this.snackBarService.open('Curso deletado com sucesso!!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        console.log(error.error.data);
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao deletar curso: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao deletar curso');
      }
    }
  }

  async deleteCurso(curso: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete('curso');
    if (res) {
      await this.deleteCursoPermanent(curso.idcurso);
    }
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }
  
}
