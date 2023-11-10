import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { aluno } from 'src/app/modelo/aluno';
import { red } from 'src/app/modelo/red';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { redService } from 'src/app/services/red.service';
import { AssociarDisciplinaComponent } from '../../associar-disciplina/associar-disciplina.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarRedComponent implements OnInit {

  reds: red[] = [];
  filtredReds: red[] = [];
  dataSource: any;

  displayedColumns = ['inicioRed', 'terminoRed', 'prazoPee', 'Situação', 'acoes'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private redservice: redService,
    private dialog: MatDialog, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string) { }

  ngOnInit(): void {
    this.findAll()
  }

  async findAll() {
    try {
      const response = await this.redservice.getRed();
      console.log(response);
      this.reds = response.data.reds;
      console.log(this.reds);
      this.reds = this.reds.filter(red => red.situacao === "Em andamento");
      this.dataSource = new MatTableDataSource<red>(this.reds);   
      
    } catch (error) {
      console.error("Erro ao buscar REDs:", error);
    }
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return ''; 
    }
  }

  editarAluno (aluno: aluno) {

  }

  deleteAluno(aluno: aluno){

  }

  associarDisciplina(red: red){
    const editar =  this.dialog.open(AssociarDisciplinaComponent, {
      data: {idRED: red.idRED, servidor_idservidor: red.coordenador}
  });
  this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any){
    dialog.afterClosed().subscribe((result: string) => {
        this.findAll();
    });
  }
}