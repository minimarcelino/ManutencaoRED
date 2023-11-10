import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { servidorService } from 'src/app/services/servidor.service';
import { MatDialog } from '@angular/material/dialog';
import { disciplinaService } from 'src/app/services/disciplina.service';
import { MatPaginator } from '@angular/material/paginator';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { disciplina } from 'src/app/modelo/disciplina';
import { storageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css']
})
export class DisciplinasComponent implements OnInit{
  dataToImport: any;
  data: any[] = [];
  disciplinas: any[] = [];
  dataSource: any;
  user: any;
  mostrarBotao: boolean = false;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['sigla', 'nomedisciplina', 'curso_idcurso', 'acoes'];

  constructor(private http: HttpClient, private router: Router, private servidorService: servidorService, public dialogQuestionService: messageDialog, private disciplinaservice: disciplinaService ,
    private dialog: MatDialog, private storage: storageService) {}

  ngOnInit() {
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  onFileChange(event: any) {
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
            curso_idcurso: 1,
            nomedisciplina: nome
          };
        } else {
          return {
            sigla: null,
            curso_idcurso: 1,
            nomedisciplina: "Nome não encontrado"
          };
        }
      });
      this.data.forEach(item =>
        this.servidorService.exportDisciplina(item)
      );
    };
  }

  async cadastrar(){
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);

    if (this.user.tiposervidor == 'administrador') {
      this.router.navigate(['/admin/cadastrarDisciplina']);
    } else {
      this.router.navigate(['/coordenador/cadastrarDisciplina']);
    }
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll(){
    const response = await this.disciplinaservice.getDisciplina();
    this.disciplinas = response.data.disciplinas;
    this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
    this.dataSource.paginator=this.paginator;
    if(this.user.tiposervidor == 'administrador'){
      this.mostrarBotao = true;
    }
  }

  irAssociar(){
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['admin/associarDisciplinas']);
    } 
  }

  /*editarDocente(disciplina: any){
    const editar =  this.dialog.open(EditarDisciplinaComponent, {
      data: {idservidor: docente.idservidor, prontuario: docente.prontuario, nome: docente.nome, email: docente.email, 
             tiposervidor: docente.tiposervidor}
    });
    this.handleDialogConfirm(editar);
  }

  deleteDocente(docente: any){

  }*/ 
  
  handleDialogConfirm(dialog: any){
    dialog.afterClosed().subscribe((result: string) => {
        this.findAll();
    });
  }

}
