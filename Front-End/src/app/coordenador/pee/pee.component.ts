import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { Router } from '@angular/router';
import { peeService } from 'src/app/services/pee.service';
import { formatDate } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { red } from 'src/app/modelo/red';
import { AssociarProfessoresComponent } from '../associar-professores/associar-professores.component';
import { pee } from 'src/app/modelo/pee';
@Component({
  selector: 'app-pee',
  templateUrl: './pee.component.html',
  styleUrls: ['./pee.component.css']
})
export class PeeComponent implements OnInit {
  pees: pee[] = [];
  reds: red[] = [];
  data: any[] = [];

  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['prazofinal', 'dataEnvioProposta', 'dataAvaliacao', 'Ações'];

  constructor(private snackBar: MatSnackBar, private router: Router, public dialogQuestionService: messageDialog,
    private peeservice: peeService, private dialog: MatDialog, private _adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.findAll()
  }

  async findAll() {
    const response = await this.peeservice.getPee();
    this.pees = response.data.pee;
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  formatData(data: Date): string {
    if (data) {
      return formatDate(data, 'dd/MM/yyyy', 'en-US', 'UTC');
    } else {
      return '';
    }
  }

  associarProfessor(red: red) {
    const editar = this.dialog.open(AssociarProfessoresComponent, {
      data: {}
    });
    this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }

}
