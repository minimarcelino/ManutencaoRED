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
import { CustomPaginatorIntlService } from 'src/app/services/customPaginatorIntl.service';

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
    private snackBarService: SnackBarService,
    private customPaginatorIntlService: CustomPaginatorIntlService,
  ) { }

  ngOnInit() {
    this.associarProfessor = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      checkbox: new FormControl('', [Validators.required]),
    });
    // console.log('PEE da associação\n', this.data.pee); //Não tem a red

    this.findAllServidores();
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
  }

  ngAfterViewInit() {
    this.paginator._intl = this.customPaginatorIntlService.paginatorIntl;
  }


  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  async findAllServidores() {
    try {
      // Consulta ao banco de dados para obter todos os servidores disponíveis
      const response = await this.docenteService.getServidores();
      this.professores = response.data.servidores;
      this.professores = this.professores.filter(
        (servidor) =>
          servidor.tiposervidor === 'professor' ||
          servidor.tiposervidor === 'coordenador'
      );

      // Servidores já associados ao PEE
      const servidoresAssociadosIds = this.data.pee.pee_servidor.map((item: any) => item.servidorId);
      // Filtra os servidores já associados
      const professoresAssociados = this.professores.filter(
        (professor) => servidoresAssociadosIds.includes(professor.idservidor)
      );
      this.professoresSelecionados = [...professoresAssociados];
      // Atualiza o dataSource2 para exibir os professores já associados no grupo de baixo
      this.dataSource2 = new MatTableDataSource<any>(professoresAssociados);

      // Remove os professores já associados do grupo de cima
      this.professores = this.professores.filter(
        (professor) => !servidoresAssociadosIds.includes(professor.idservidor)
      );
      // Atualiza o dataSource para exibir os professores restantes no grupo de cima
      this.dataSource = new MatTableDataSource<any>(this.professores);
      this.dataSource.paginator = this.paginator;
    } catch (error: any) {
      console.error('Erro ao obter servidores associados:', error);
    }
  }

  async selecionarProfessor(docente:any){

try{

const professoresAtualizados = [

...this.data.pee.pee_servidor.map(
(item:any)=>({
 idservidor:item.servidorId
})
),

{
 idservidor:docente.idservidor
}

];


await this.peeService.updatePee({

idpee:this.data.idPEE,

pee_servidor:professoresAtualizados,

situacao:'Aguardando Preenchimento'

});


this.dataSource2.data=[
...this.dataSource2.data,
docente
];


this.professores =
this.professores.filter(
(item)=>
item.idservidor !== docente.idservidor
);


this.dataSource.data=[
...this.professores
];


this.snackBarService.open(
'Professor associado com sucesso!'
);


}catch(error){

console.error(error);

this.snackBarService.open(
'Falha ao associar professor'
);

}

}
  /* 
  selecionarProfessor(docente: any) {
    // Verifica se o professor já foi selecionado
    const professorExistenteIndex = this.professoresSelecionados.findIndex(
      (professor) => professor.idservidor === docente.idservidor
    );
    if (professorExistenteIndex === -1) {
      // Adiciona o professor ao array de professores selecionados
      this.professoresSelecionados.push(docente);

      // Atualiza o dataSource2 para incluir o novo professor sem substituir os existentes
      this.dataSource2.data.push(docente);
      this.dataSource2._updateChangeSubscription();

      // Remove o professor do array original
      const index = this.professores.findIndex((item) => item.idservidor === docente.idservidor);
      if (index >= 0) {
        this.professores.splice(index, 1);
        this.dataSource = new MatTableDataSource<any>(this.professores);
        this.dataSource.paginator = this.paginator;
      }

      // Atualiza o MatTableDataSource para exibir os professores restantes no grupo de cima
      this.dataSource.data = [...this.professores];
    } else {
      // Se o professor já foi selecionado, exibe uma mensagem informando ao usuário
      this.snackBarService.open('Este professor já foi selecionado');
    }
  }
    */

  async removerProfessor(docente: any) {

  const confirmar =
    await this.dialogQuestionService
      .openDialogRemoveProfessor();

  if (!confirmar) {
    return;
  }

  try {

    const professoresAtualizados =
      this.data.pee.pee_servidor
        .filter(
          (item: any) =>
            item.servidorId !== docente.idservidor
        )
        .map(
          (item: any) => item.servidor
        );

    await this.peeService.updatePee({

      idpee: this.data.idPEE,

      conteudo: '',
      metodologia: '',
      trabalhos: '',
      bibliografia: '',
      criterios: '',

      prazofinal: this.data.pee.prazofinal,

      RED_idRED: this.data.idRED,

      pee_servidor: professoresAtualizados,

      percentualabono:
        this.data.pee.percentualabono,

      situacao:
        professoresAtualizados.length > 0
          ? 'Aguardando Preenchimento'
          : 'Aguardando Associação de Professor',
    });

    this.snackBarService.open(
      'Professor removido com sucesso!'
    );

    this.dialog.close(true);

  } catch (error: any) {

    console.error(error);

    this.snackBarService.open(
      'Falha ao remover professor'
    );
  }
}

  /*
  async removerProfessor(docente: any) {
    const professorExistenteIndex = this.professoresSelecionados.findIndex(
      (professor) => professor.idservidor === docente.idservidor
    );
    if (professorExistenteIndex >= 0) {
      this.professoresSelecionados.splice(professorExistenteIndex, 1);

      // Remove a disciplina do dataSource2
      this.dataSource2.data = this.dataSource2.data.filter(
        (item: any) => item.idservidor !== docente.idservidor
      );

      // Adiciona a disciplina removida de volta ao grupo de cima
      this.professores.push(docente);
      this.dataSource.data = [...this.professores]; // Atualiza o dataSource
    } else {
      // Se o professor já estava associada anteriormente, precisamos removê-lo
      const servidoresAssociadosIds = this.data.pee.pee_servidor.map((item: any) => item.servidorId);
      // Filtra os servidores já associados
      const professoresAssociados = this.professores.filter(
        (professor) => servidoresAssociadosIds.includes(professor.idservidor)
      );
      const removerDisciplina = await this.dialogQuestionService.openDialogRemoveProfessor();
      if (removerDisciplina === false) {
        return;
      }
      if (professoresAssociados) {
        try {
          // Remove a disciplina do dataSource2
          this.dataSource2.data = this.dataSource2.data.filter(
            (item: any) => item.idservidor !== docente.idservidor
          );

          // Adiciona a disciplina removida de volta ao grupo de cima
          this.professores.push(docente);
          this.dataSource.data = [...this.professores]; // Atualiza o dataSource
        } catch (error: any) {
          console.error('Erro ao remover servidor:', error);
        }
      }
    }
  }
    */

  async cadastrar() {
    try {
      console.log("TESTE:",this.professoresSelecionados);
      await this.peeService.updatePee({
        idpee: this.data.idPEE,
        conteudo: '',
        metodologia: '',
        trabalhos: '',
        bibliografia: '',
        criterios: '',
        prazofinal: this.data.prazoFinal,
        RED_idRED: this.data.idRED,

        pee_servidor: this.professoresSelecionados,
        percentualabono: this.data.percentualabono,
        situacao: 'Aguardando Preenchimento',
      });

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
    this.dialog.close(this.professoresSelecionados);
  }

  apresentarDisciplina() {
    const nomeDisciplina = this.data.pee.disciplinas.nomeDisciplina;
    const siglaDisciplina = this.data.pee.disciplinas.sigla;
    const nomeCurso = this.data.pee.disciplinas.curso.nomeCurso;
    return `Disciplina ${nomeDisciplina} (${siglaDisciplina}) do curso ${nomeCurso}`;
  }
}
