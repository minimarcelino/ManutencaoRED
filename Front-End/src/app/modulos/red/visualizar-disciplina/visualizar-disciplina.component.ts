import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { disciplina } from 'src/app/modelo/disciplina';
import { NotificationService } from 'src/app/services/notification.service';
import { servidor } from 'src/app/modelo/servidor';

@Component({
  selector: 'app-visualizar-disciplina',
  templateUrl: './visualizar-disciplina.component.html',
  styleUrls: ['./visualizar-disciplina.component.css'],
})
export class VisualizarDisciplinaComponent implements OnInit {
  visualizarDisciplina!: FormGroup;
  user: any;
  disciplinas: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['professor', 'sigla', 'nomedisciplina', 'situacao', 'acoes'];

  constructor(
    public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<VisualizarDisciplinaComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.visualizarDisciplina = new FormGroup({
      professor: new FormControl({ value: this.data.pee, disabled: true }, [
        Validators.required,
      ]),
      sigla: new FormControl({ value: this.data.pee, disabled: true }, [
        Validators.required,
      ]),
      nomedisciplina: new FormControl(
        { value: this.data.motivoAfastamento, disabled: true },
        [Validators.required]
      ),
    });
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.disciplinas = this.data.pee;
    this.dataSource = new MatTableDataSource<any>(this.disciplinas);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  cancelar() {
    this.dialog.close();
  }

  verificarSituacao(): boolean[] {
    const situacoes: boolean[] = [];
    for (const item of this.data.pee) {
      situacoes.push(item.situacao === 'Aguardando Preenchimento' || item.situacao === 'Enviado para o aluno');
    }
    return situacoes;
  }

  sendEmailProfessor(pee: any){
    this.notificationService.sendEmailProfessor(pee.servidor_idservidor, pee.idpee);
  }
}
