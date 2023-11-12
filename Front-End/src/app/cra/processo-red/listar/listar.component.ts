import { formatDate } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { red } from 'src/app/modelo/red';
import { alunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';
import { servidorService } from 'src/app/services/servidor.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarREDComponent implements OnInit {

  reds: red[] = [];
  alunos: aluno[] = [];
  dataSource: any;
  user:any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;
  
  displayedColumns = ['Prontuário', 'Início RED', 'Tempo Afastamento', 'Previsão Término', 'Situação', 'Ações'];

  constructor(private router: Router,private alunoservice: alunoService,private redservice: redService,
     public dialogQuestionService: messageDialog, private servidorservice: servidorService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async findAll(){
    const response = await this.alunoservice.getAluno();
    const response2 = await this.redservice.getRed();
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


  async cadastrarRed() {
    if(this.user.tiposervidor == 'administrador'){
      this.router.navigate(['/admin/cadastrarRed'])
    } else {
      this.router.navigate(['/cra/processo-red']);
    }
  }

  /*editarRed(red: any){
    const editar =  this.dialog.open(EditarREDComponent, {
        data: {id: red.id, motivoAfastamento: red.motivoAfastamento, inicioAfastamento: red.inicioAfastamento, 
               dataPrevisaoTermino: red.dataPrevisaoTermino, situacao: red.situacao, observacao: red.observacao}
    });
    this.handleDialogConfirm(editar);
  }*/

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

  handleDialogConfirm(dialog: any){
    dialog.afterClosed().subscribe((result: string) => {
        this.findAll();
    });
  }
}
