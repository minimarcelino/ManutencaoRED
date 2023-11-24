import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { docente } from 'src/app/modelo/docente';
import { docenteService } from 'src/app/services/docente.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { peeService } from 'src/app/services/pee.service';
import { storageService } from 'src/app/services/storage.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';
@Component({
  selector: 'app-associar-professores',
  templateUrl: './associar-professores.component.html',
  styleUrls: ['./associar-professores.component.css']
})
export class AssociarProfessoresComponent implements OnInit {

  associarProfessor!: FormGroup;
  professoresSelecionados: any[] = [];
  professores: any[] = [];
  dataSource: any;
  dataSource2: any;
  user: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['nome', 'email', 'acoes'];

  constructor(private http: HttpClient, private router: Router, private docenteservice: docenteService, public dialogQuestionService: messageDialog,
    private dialog: MatDialogRef<AssociarProfessoresComponent>, private storage: storageService, @Inject(MAT_DIALOG_DATA) public data: any, private peeservice: peeService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.associarProfessor = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      checkbox: new FormControl('', [Validators.required]),
    });
    this.findAll();
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
  }

  async findAll() {
    const response = await this.docenteservice.getDocente();
    this.professores = response.data.servidores;
    this.dataSource = new MatTableDataSource<docente>(this.professores);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  selecionarProfessor(docente: any) {
    this.professoresSelecionados.push(docente);
    this.dataSource2 = new MatTableDataSource<docente>(this.professoresSelecionados);
  }

  removerProfessor(docente: any) {
    const index = this.professoresSelecionados.findIndex((item) => item.id === docente.id);
    if (index >= 0) {
      this.professoresSelecionados.splice(index, 1);
      this.dataSource2 = new MatTableDataSource<docente>(this.professoresSelecionados);
    }
  }

  async cadastrar() {
    try {
      for (const item of this.professoresSelecionados) {
        await this.peeservice.updatePee({
          idpee: this.data.idPEE,
          conteudo: '',
          metodologia: '',
          trabalhos: '',
          bibliografia: '',
          criterios: '',
          prazofinal: new Date(),
          RED_idRED: this.data.idRED,
          disciplinas_iddisciplinas: item.iddisciplinas,
          servidor_idservidor: this.professoresSelecionados[0].idservidor,
          percentualabono: 0.0,
        });
      }
      this.openSnackBar("Professores associados com sucesso!!", null);
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.openSnackBar("Falha ao cadastrar disciplina", errorMessage);
      } else {
        this.openSnackBar("Falha ao cadastrar disciplina", "Ocorreu um erro durante o cadastro da disciplina.");
      }
    }
  }

  openSnackBar(message: string, error: string | Error | null) {
    let data;
    if (error === null) {
      data = { message };
    } else if (typeof error === 'string') {
      data = { message: error };
    } else if (error instanceof Error) {
      data = { message: error.message };
    }

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: data,
      duration: 3000
    });
  }
}
