import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { curso } from '../../../modelo/curso';
import { servidor } from 'src/app/modelo/servidor';
import { messageDialog } from '../../../services/messageDialog.service';
import { cursoService } from 'src/app/services/cursos.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarComponent } from '../editar/editar.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit{

  items: any[] = [];
  coordenador: servidor[] = [];
  cursos: curso[] = [];
  dataSource: any;

  displayedColumns = ['nomecurso', 'sigla', 'acoes'];

    constructor(private router: Router, public dialogQuestionService: messageDialog, private cursoservice: cursoService,
      private dialog: MatDialog){}

    ngOnInit(): void {
      this.findAll()
    }

    async cadastrar(){
      this.router.navigate(['/csp/cadastrar']);
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
          data: {idcurso: curso.idcurso, nomecurso: curso.nomecurso, sigla: curso.sigla, coordenador: curso.cordenador}
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

}
