import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { peeService } from 'src/app/services/pee.service';

@Component({
  selector: 'app-pees-abonados',
  templateUrl: './pees-abonados.component.html',
  styleUrls: ['./pees-abonados.component.css']
})
export class PeesAbonadosComponent implements OnInit{

  pees: pee[] = [];
  user: any = '';
  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['disciplina', 'nome', 'prontuario', 'email', 'abono'];

  constructor(private router: Router, public dialogQuestionService: messageDialog, private peeService: peeService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async findAll() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    this.pees = this.pees.filter(pee => pee.servidor_idservidor == this.user.idservidor);
    this.pees = this.pees.filter(pee => pee.percentualabono != 0);
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }
}