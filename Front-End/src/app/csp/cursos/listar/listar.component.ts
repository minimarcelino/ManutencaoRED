import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { curso } from '../../../modelo/curso';
import * as XLSX from 'xlsx';
import { servidor } from 'src/app/modelo/servidor';
import { messageDialog } from '../../../services/messageDialog.service';
import { cursoService } from 'src/app/services/cursos.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarComponent } from '../editar/editar.component';
import { MatTableDataSource } from '@angular/material/table';
import { servidorService } from 'src/app/services/servidor.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarCursosComponent implements OnInit{

  items: any[] = [];
  data: any[] = [];
  coordenador: servidor[] = [];
  cursos: curso[] = [];
  dataSource: any;
  user:any;

  displayedColumns = ['nomeCurso', 'sigla', 'acoes'];

    constructor(private router: Router, public dialogQuestionService: messageDialog, private cursoservice: cursoService,
      private dialog: MatDialog, private servidorservice: servidorService, private snackBar: MatSnackBar){}

    ngOnInit(): void {
      this.findAll();
      this.user = localStorage.getItem("user");
      this.user = JSON.parse(this.user);
    }

    async cadastrar(){
      if(this.user.tiposervidor == 'administrador'){
        this.router.navigate(['admin/cadastrarCurso']);
      } else {
        this.router.navigate(['/csp/cadastrar']);
      }
    }

    async findAll(){
      const response = await this.cursoservice.getCursos();
      this.cursos = response.data.cursos;
      this.dataSource = new MatTableDataSource<curso>(this.cursos);
    }

    applyFilter(data: Event) {
      const value = (data.target as HTMLInputElement).value;
      this.dataSource.filter = value;
    }

    editarCurso(curso: any){
      const editar =  this.dialog.open(EditarComponent, {
          data: {idcurso: curso.idcurso, nomeCurso: curso.nomeCurso, sigla: curso.sigla, coordenador: curso.coordenador}
      });
      this.handleDialogConfirm(editar);
    }

    async deleteCursoPermanent(id: number) {
      try {
        let response = await this.cursoservice.deleteCurso(id);
        if (response) {
          this.findAll();
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    async deleteCurso(curso: any){
      let res = false;
      res = await this.dialogQuestionService.openDialogConfirmDelete('curso');
      if (res) {
        await this.deleteCursoPermanent(curso.idcurso);
      }
    }

    

    handleDialogConfirm(dialog: any){
      dialog.afterClosed().subscribe((result: string) => {
          this.findAll();
      });
    }

    onFileChange(event: any, curso: any) {
      const target: DataTransfer = <DataTransfer>(event.target);
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
          const componente = item["Componente"];
          const nomeSplit = componente.split(" - ");
          
          if (nomeSplit.length === 2) {
            const nome = nomeSplit[1];
            const sigla = item["Sigla"];
            const regexSiglaResult = /\((.*?)\)/.exec(sigla);
            const dentroParenteses = regexSiglaResult ? regexSiglaResult[1] : null;
        
            return {
              sigla: dentroParenteses,
              curso_idcurso: curso.idcurso,
              nomedisciplina: nome
            };
          } else {
            return {
              sigla: null,
              curso_idcurso: curso.idcurso,
              nomedisciplina: "Nome não encontrado"
            };
          }
        });
        this.data.forEach(item =>
          this.servidorservice.exportDisciplina(item)
        );
        this.openSnackBar("Importação das disciplinas realizadas! ", null);
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
        duration: 3000
      });
    }
}
