import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { servidorService } from 'src/app/services/servidor.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { docente } from 'src/app/modelo/docente';
import { EditarDocenteComponent } from '../docente/editar/editar.component'
import { messageDialog } from 'src/app/services/messageDialog.service';
import { docenteService } from 'src/app/services/docente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
import { response } from 'express';
@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit {
  dataToImport: any;
  docentes: any[] = [];
  data: any[] = [];
  dataSource: any;
  user: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['prontuario', 'nome', 'email', 'acoes'];

  constructor(private http: HttpClient, private servidorService: servidorService,private router:  Router, public dialogQuestionService: messageDialog, private docenteservice: docenteService,
    private dialog: MatDialog,private snackBar: MatSnackBar) {}

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
        this.data = data;
        console.log(this.data);
    
        const importPromises = this.data.map(item => {
          return this.servidorService.exportProfessor({
            email: item["E-mail"],
            tiposervidor: "professor",
            senha: 'ifsp',
            nome: item.Nome,
            prontuario: item["Prontuário"]
          });
        });
    
        Promise.all(importPromises)
          .then((responses) => {
            const hasError = responses.some(response => response.ok === false);
            if (hasError) {
              this.openSnackBar("Erro na importação. Verifique os detalhes.", null);
            } else {
              this.openSnackBar("Importação dos docentes foi realizada!", null);
            }
          })
          .catch(error => {
            this.openSnackBar(`Erro na importação: ${error}`, null);
          })
          .finally(() => {
            this.findAll();
          });
      };
    }
    
  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    console.log(this.dataSource);
  }

  async cadastrar(){
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['admin/cadastrarDocente'])
    } else {
      this.router.navigate(['/csp/cadastrarDocentes']);
    }
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll(){
    const response = await this.docenteservice.getDocente();
    this.docentes = response.data.servidores;
    this.dataSource = new MatTableDataSource<docente>(this.docentes);
    this.dataSource.paginator=this.paginator;
  }

  editarDocente(docente: any){
    const editar =  this.dialog.open(EditarDocenteComponent, {
      data: {idservidor: docente.idservidor, prontuario: docente.prontuario, nome: docente.nome, email: docente.email, 
             tiposervidor: docente.tiposervidor, senha: docente.senha}
    });
    this.handleDialogConfirm(editar);
  }

  deleteDocente(docente: any){

  }

  handleDialogConfirm(dialog: any){
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
