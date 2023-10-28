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
export class ListarComponent implements OnInit{

  alunos: aluno[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator !:MatPaginator;

  displayedColumns = ['prontuario', 'nome', 'data', 'endereco', 'telefone', 'email', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private alunoservice: alunoService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string){}

    ngOnInit(): void {
      this.findAll()
    }

    async cadastrar(){
      this.router.navigate(['/cra/cadastrar']);
    }

    applyFilter() {
      /*this.dataSource.filter = filterValue.trim().toLowerCase();*/
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
          data: {id: aluno.id, prontuario: aluno.prontuario, nome: aluno.nome, data: aluno.data_nascimento, endereco: aluno.endereco, 
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
