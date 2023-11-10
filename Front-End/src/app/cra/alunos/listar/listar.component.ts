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

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarAlunoComponent implements OnInit{

  alunos: aluno[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;
  user:any;

  displayedColumns = ['prontuario', 'nome', 'data', 'endereco', 'telefone', 'email', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private alunoservice: alunoService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string){}

    ngOnInit(): void {
      this.findAll();
      this.user = localStorage.getItem("user");
      this.user = JSON.parse(this.user);
    }

    async cadastrar(){
      if(this.user.tiposervidor == 'administrador'){
        this.router.navigate(['/admin/cadastrarAluno']);
      } else {
        this.router.navigate(['/cra/cadastrar']);
      }
    }

    applyFilter(data: Event) {
      const value = (data.target as HTMLInputElement).value;
      this.dataSource.filter = value;
    }
    

    async findAll(){
      const response = await this.alunoservice.getAluno();
      this.alunos = response.data.alunos;
      this.dataSource = new MatTableDataSource<aluno>(this.alunos);
      this.dataSource.paginator=this.paginator;
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
          this.findAll();
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    editarAluno(aluno: any){
      const editar =  this.dialog.open(EditarComponent, {
          data: {id: aluno.id, prontuario: aluno.prontuario, nome: aluno.nome, data: aluno.dataNascimento, endereco: aluno.endereco, 
                 telefone: aluno.telefone, email: aluno.email, curso: aluno.curso}
      });
      this.handleDialogConfirm(editar);
    }
  
    async deleteAluno(aluno: any){
      let res = false;
      res = await this.dialogQuestionService.openDialogConfirmDelete('aluno');
      if (res) {
        await this.deleteAlunoPermanent(aluno.id);
      }
    }

    handleDialogConfirm(dialog: any){
      dialog.afterClosed().subscribe((result: string) => {
          this.findAll();
      });
    }
}
