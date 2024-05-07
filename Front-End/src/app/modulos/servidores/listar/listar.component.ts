import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { docente } from 'src/app/modelo/docente';
import { ServidorService } from 'src/app/services/servidor.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { EditarServidoresComponent } from '../editar/editar.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarServidoresComponent implements OnInit {
  servidores: any[] = [];
  dataSource: any;
  servidoresFiltrados: any[] = [];
  tiposServidores = ['administrador', 'professor', 'coordenador', 'cra', 'csp'];
  tipoSelecionado = 'todos';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: any;
  dadosImportados: any[] = [];

  displayedColumns = ['prontuario', 'nome', 'email', 'acoes'];
  fileInput: any;

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
    if (!this.isADM()) {
      this.servidores = servidor.filter(
        (docente: any) =>
          docente.tiposervidor === 'professor' ||
          docente.tiposervidor === 'coordenador'
      );
    } else {
      this.servidores = servidor;
    }

    this.dataSource = new MatTableDataSource<docente>(this.servidores);
    this.dataSource.paginator = this.paginator;
  }

  editarServidor(servidor: any) {
    const editar = this.dialog.open(EditarServidoresComponent, {
      data: {
        idservidor: servidor.idservidor,
        prontuario: servidor.prontuario,
        nome: servidor.nome,
        email: servidor.email,
        tiposervidor: servidor.tiposervidor,
      },
    });
    this.handleDialogConfirm(editar);
  }

  async deleteServidorPermanent(idservidor: number) {
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

  async deleteServidor(servidor: any) {
    let res = false;
    res = await this.dialogQuestionService.openDialogConfirmDelete('docente');
    if (res) {
      await this.deleteServidorPermanent(servidor.idservidor);
    }
  }

  // Cadastro de servidores a partir de arquivo XLSX
  cadastroServidorLote(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      this.dadosImportados = data;
      console.log(this.dadosImportados);

      const importPromises = this.dadosImportados.map(item => {
        return this.servidorService.createServidor({
          email: item["E-mail"],
          tiposervidor: "professor",
          senha: 'ifsp',
          nome: item.Nome,
          prontuario: item["Prontuário"]
        });
      });

      Promise.all(importPromises)
        .then((responses) => {
          const hasError = responses.some(response => response.ok === false);
          if (hasError) {
            this.snackBarService.open(`Erro na importação. Verifique os detalhes.`);
          } else {
            this.snackBarService.open(`Importação dos docentes foi realizada!`);
          }
        })
        .catch (error => {
          if (error && error.error && error.error.data) {
            const errorMessage = error.error.data;
            this.snackBarService.open(`Erro na importação de servidores: ${errorMessage}`);
          } else {
            this.snackBarService.open(`Erro na importação de servidores`);
          }
        })
        .finally(() => {
          this.findAll();
        });
    };
  }

  aplicarFiltros() {
    // Aplica os filtros de curso e situação simultaneamente
    this.servidoresFiltrados = this.servidores.filter(
      (servidor) =>
        (this.tipoSelecionado === 'todos' ||
          servidor.tiposervidor === this.tipoSelecionado)
    );

    // Atualiza o dataSource com os REDs filtrados
    this.dataSource = new MatTableDataSource<any>(this.servidoresFiltrados);
    this.dataSource.paginator = this.paginator;
  }

  filroPorTipo(event: MatSelectChange) {
    // Atualiza o filtro de curso e aplica todos os filtros novamente
    this.tipoSelecionado = event.value;
    this.aplicarFiltros();
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }

  isADM(){
    return this.user.tiposervidor === 'administrador';
  }
}
