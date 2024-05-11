import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { docente } from 'src/app/modelo/docente';
import { ServidorService } from 'src/app/services/servidor.service';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';
import { CursoService } from 'src/app/services/cursos.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-associar-professores',
  templateUrl: './associar-professores.component.html',
  styleUrls: ['./associar-professores.component.css'],
})
export class AssociarProfessoresComponent implements OnInit {
  associarProfessor!: FormGroup;
  professoresSelecionados: any[] = [];
  professores: any[] = [];
  dataSource: any;
  dataSource2: any;
  user: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['Nome', 'Email', 'Acoes'];

  constructor(
    private dialog: MatDialogRef<AssociarProfessoresComponent>,
    public dialogQuestionService: messageDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private docenteService: ServidorService,
    private peeService: PeeService,
    private cursoService: CursoService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.associarProfessor = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      checkbox: new FormControl('', [Validators.required]),
    });
    console.log('PEE da associação\n', this.data.pee); //Não tem a red

    this.findAllServidores();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  async findAllServidores() {
    const response = await this.docenteService.getServidores();
    this.professores = response.data.servidores;
    this.professores = this.professores.filter(
      (servidor) =>
        servidor.tiposervidor === 'professor' ||
        servidor.tiposervidor === 'coordenador'
    );
    this.dataSource = new MatTableDataSource<docente>(this.professores);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  selecionarProfessor(docente: any) {
    this.professoresSelecionados.push(docente);
    this.dataSource2 = new MatTableDataSource<docente>(
      this.professoresSelecionados
    );
  }

  removerProfessor(docente: any) {
    const index = this.professoresSelecionados.findIndex(
      (item) => item.id === docente.id
    );
    if (index >= 0) {
      this.professoresSelecionados.splice(index, 1);
      this.dataSource2 = new MatTableDataSource<docente>(
        this.professoresSelecionados
      );
    }
  }

  async cadastrar() {
    try {
      for (const item of this.professoresSelecionados) {
        await this.peeService.updatePee({
          idpee: this.data.idPEE,
          conteudo: '',
          metodologia: '',
          trabalhos: '',
          bibliografia: '',
          criterios: '',
          prazofinal: this.data.red.dataPrevisaoTermino,
          RED_idRED: this.data.idRED,
          disciplinas_iddisciplinas: item.iddisciplinas,
          servidor_idservidor: this.professoresSelecionados[0].idservidor,
          percentualabono: this.data.percentualabono,
          situacao: 'Aguardando Preenchimento',
        });
      }
      this.snackBarService.open('Professores associados com sucesso!!');
      this.dialog.close();
    } catch (error: any) {
      if (error && error.error && error.error.data) {
        const errorMessage = error.error.data;
        this.snackBarService.open(
          `Falha ao associar Professor: ${errorMessage}`
        );
      } else {
        this.snackBarService.open('Falha ao associar Professor');
      }
    }
  }

  cancelar() {
    this.dialog.close();
  }

  apresentarDisciplina(){
    const nomeDisciplina = this.data.pee.disciplinas.nomeDisciplina;
    const siglaDisciplina = this.data.pee.disciplinas.sigla;
    const nomeCurso = this.data.pee.disciplinas.curso.nomeCurso;
    return `Disciplina ${nomeDisciplina} (${siglaDisciplina}) do curso ${nomeCurso}`;
  }
}
