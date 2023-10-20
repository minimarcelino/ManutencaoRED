import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { curso } from 'src/app/modelo/curso';
import { servidor } from 'src/app/modelo/servidor';
import { messageDialog } from '../../services/messageDialog.service';
import { cursoService } from 'src/app/services/cursos.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit{

  items: any[] = [];
  coordenador: servidor[] = [];
  cursos: curso[] = [/*{
    idcurso: 1,
    sigla: "bee",
    nomecurso: "beeeee",
    coordenador: {
      idservidor: 1,
      email: "igo@igo.com",
      tiposervidor: 1,
      senha: "123",
      nome: "igor",
    }
  }*/];

  displayedColumns = ['nomecurso', 'sigla', 'coordenador', 'acoes'];

    constructor(private router: Router, public dialogQuestionService: messageDialog, private cursoservice: cursoService){}

    ngOnInit(): void {
      this.findAll()
    }

    async cadastrar(){
      this.router.navigate(['/curso/cadastrar']);
    }

    async findAll(){
      const response = await this.cursoservice.getCursos();
      const id = response.data.cursos[0].cordenador;
      //const response2 = await this.cursoservice.getCoordenadorById(Number(id));
      this.cursos = response.data.cursos;
    }

    async deleteCursoPermanent(id: number) {
      try {
        let response = await this.cursoservice.deleteCurso(id)
        if (response) {
          //this.findAll()
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    async deleteCurso(curso: any){
      console.log(curso);
      let res = false;
      res = await this.dialogQuestionService.openDialogConfirmDelete('curso');
      if (res) {
        await this.deleteCursoPermanent(curso.id)
      }
    }

}
