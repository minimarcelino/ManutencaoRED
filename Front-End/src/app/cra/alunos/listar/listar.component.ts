import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { alunoService } from 'src/app/services/alunos.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { EditarComponent } from '../editar/editar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit{

  alunos: aluno[] = [];

  displayedColumns = ['prontuario', 'nome', 'data', 'endereco', 'telefone', 'email', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private alunoservice: alunoService,
    private dialog: MatDialog){}

    ngOnInit(): void {
      this.findAll()
    }

    async cadastrar(){
      this.router.navigate(['/cra/cadastrar']);
    }

    async findAll(){
      const response = await this.alunoservice.getAluno();
      this.alunos = response.data.alunos;
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
        await this.deleteAlunoPermanent(aluno.prontuario);
      }
    }

    handleDialogConfirm(dialog: any){
      dialog.afterClosed().subscribe((result: string) => {
          this.findAll();
      });
    }
}
