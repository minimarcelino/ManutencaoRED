import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

import { curso } from '../../../modelo/curso';
import { servidor } from 'src/app/modelo/servidor';
import { messageDialog } from '../../../services/messageDialog.service';
import { cursoService } from 'src/app/services/cursos.service';
import { EditarCursoComponent } from '../editar/editar.component';
import { servidorService } from 'src/app/services/servidor.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarCursosComponent implements OnInit {
  items: any[] = [];
  data: any[] = [];
  coordenador: servidor[] = [];
  cursos: curso[] = [];
  dataSource: any;
  user: any;

  displayedColumns = ['nomeCurso', 'sigla', 'acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private cursoService: cursoService,
    private dialog: MatDialog,
    private servidorservice: servidorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async cadastrar() {
    this.router.navigate([`/${this.user.tiposervidor}/cadastrarCursos`]);
  }

  async findAll() {
    const response = await this.cursoService.getCursos();
    this.cursos = response.data.cursos;
    this.dataSource = new MatTableDataSource<curso>(this.cursos);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  editarCurso(curso: any) {
    const editar = this.dialog.open(EditarCursoComponent, {
      data: {
        idcurso: curso.idcurso,
        nomeCurso: curso.nomeCurso,
        sigla: curso.sigla,
        coordenador: curso.servidor,
      },
    });
    this.handleDialogConfirm(editar);
  }

  async deleteCursoPermanent(id: number) {
    try {
      let response = await this.cursoService.deleteCurso(id);
      if (response) {
        this.openSnackBar('Curso deletado com sucesso!!', null);
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        console.log(error.error.data);
        const errorMessage = error.error.data;
        this.openSnackBar('Falha ao deletar curso', errorMessage);
      } else {
        this.openSnackBar(
          'Falha ao deletar curso',
          'Ocorreu um erro durante a remoção do curso.'
        );
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

  onFileChange(event: any, curso: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      this.data = data.map((item: any) => {
        const componente = item['Componente'];
        const nomeSplit = componente.split(' - ');

        if (nomeSplit.length === 2) {
          const nome = nomeSplit[1];
          const sigla = item['Sigla'];
          const regexSiglaResult = /\((.*?)\)/.exec(sigla);
          const dentroParenteses = regexSiglaResult
            ? regexSiglaResult[1]
            : null;

          return {
            sigla: dentroParenteses,
            curso_idcurso: curso.idcurso,
            nomeDisciplina: nome,
          };
        } else {
          return {
            sigla: null,
            curso_idcurso: curso.idcurso,
            nomeDisciplina: 'Nome não encontrado',
          };
        }
      });
      this.data.forEach((item) => this.servidorservice.exportDisciplina(item));
      this.openSnackBar('Importação das disciplinas realizadas! ', null);
    };
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
      duration: 3000,
    });
  }
}
