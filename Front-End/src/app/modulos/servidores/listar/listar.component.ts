import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { docente } from 'src/app/modelo/docente';
import { ServidorService } from 'src/app/services/servidor.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { EditarServidoresComponent } from '../editar/editar.component';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarServidoresComponent implements OnInit {
  docentes: any[] = [];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: any;

  displayedColumns = ['prontuario', 'nome', 'email', 'acoes'];

  constructor(
    private router: Router,
    public dialogQuestionService: messageDialog,
    private servidorService: ServidorService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async cadastrar() {
    this.router.navigate([`/${this.user.tiposervidor}/cadastrarServidores`]);
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAll() {
    const response = await this.servidorService.getServidores();
    const servidor = response.data.servidores;

    // Niveis de acesso diferente de Administrador não devem enxergar alem de docentes
    if (this.user.tiposervidor != 'administrador') {
      this.docentes = servidor.filter(
        (docente: any) =>
          docente.tiposervidor === 'professor' ||
          docente.tiposervidor === 'coordenador'
      );
    } else {
      this.docentes = servidor;
    }

    this.dataSource = new MatTableDataSource<docente>(this.docentes);
    this.dataSource.paginator = this.paginator;
  }

  editarDocente(docente: any) {
    const editar = this.dialog.open(EditarServidoresComponent, {
      data: {
        idservidor: docente.idservidor,
        prontuario: docente.prontuario,
        nome: docente.nome,
        email: docente.email,
        tiposervidor: docente.tiposervidor,
      },
    });
    this.handleDialogConfirm(editar);
  }

  async deleteDocentePermanent(idservidor: number) {
    try {
      let response = await this.servidorService.deleteServidor(idservidor);
      if (response) {
        this.snackBarService.open('Docente deletado com sucesso!!');
        this.findAll();
      }
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(`Falha ao deletar professor: ${errorMessage}`);
      } else {
        this.snackBarService.open('Falha ao deletar professor');
      }
    }
  }

  async deleteDocente(docente: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete('docente');
    if (res) {
      await this.deleteDocentePermanent(docente.idservidor);
    }
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }
}
