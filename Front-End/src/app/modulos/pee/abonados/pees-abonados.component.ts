import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';

@Component({
  selector: 'app-pees-abonados',
  templateUrl: './pees-abonados.component.html',
  styleUrls: ['./pees-abonados.component.css'],
})
export class PEEAbonadosComponent implements OnInit {
  pees: pee[] = [];
  user: any = '';
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['disciplina', 'nome', 'prontuario', 'email', 'abono'];

  constructor(
    public dialogQuestionService: messageDialog,
    private peeService: PeeService
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async findAll() {
    const response = await this.peeService.getPee();
    this.pees = response.data.pees;
    if (this.user.tiposervidor != 'administrador') {
      this.pees = this.pees.filter(
        (pee) => pee.servidor_idservidor == this.user.idservidor
      );
    }

    // Poderia ser uma flag, ou um get proprio, e não uma comparação
    // Filtro de exibição dos PEEs abonados
    this.pees = this.pees.filter((pee) => pee.percentualabono >= 0);
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }
}
