import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

import { curso } from '../../../modelo/curso';
import { servidor } from 'src/app/modelo/servidor';
import { messageDialog } from '../../../services/messageDialog.service';
import { CursoService } from 'src/app/services/cursos.service';
import { DisciplinaService } from 'src/app/services/disciplina.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

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

  displayedColumns = ['NomeCurso', 'Sigla', 'Acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
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
      this.data.forEach((item) =>
        this.disciplinaService.exportDisciplina(item)
      );
      this.snackBarService.open('Importação das disciplinas realizadas! ');
    };
  }
}
