  import { HttpClient } from '@angular/common/http';
  import { Component, Inject, OnInit, ViewChild } from '@angular/core';
  import { FormControl, FormGroup, Validators } from '@angular/forms';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  import { MatPaginator } from '@angular/material/paginator';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatTableDataSource } from '@angular/material/table';
  import { Router } from '@angular/router';

  import { RedService } from 'src/app/services/red.service';
  import { disciplina } from 'src/app/modelo/disciplina';
  import { DisciplinaService } from 'src/app/services/disciplina.service';
  import { messageDialog } from 'src/app/services/messageDialog.service';
  import { PeeService } from 'src/app/services/pee.service';
  import { SnackBarService } from 'src/app/services/snackbar.service';
  import { storageService } from 'src/app/services/storage.service';
  import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';

  @Component({
    selector: 'app-associar-disciplina',
    templateUrl: './associar-disciplina.component.html',
    styleUrls: ['./associar-disciplina.component.css'],
  })
  export class AssociarDisciplinaComponent implements OnInit {
    associarDisciplina!: FormGroup;
    disciplinasSelecionadas: any[] = [];
    disciplinas: any[] = [];
    dataSource: any;
    dataSource2: any;
    user: any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    displayedColumns = ['Sigla', 'NomeDisciplina', 'Acoes'];

    constructor(
      private disciplinaservice: DisciplinaService,
      public dialogQuestionService: messageDialog,
      private dialog: MatDialogRef<AssociarDisciplinaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private snackBarService: SnackBarService,
      private redService: RedService,
      private peeService: PeeService  ) {}

    ngOnInit() {
      this.associarDisciplina = new FormGroup({
        sigla: new FormControl('', [Validators.required]),
        nomedisciplina: new FormControl('', [Validators.required]),
        checkbox: new FormControl('', [Validators.required]),
      });
      //console.log("RED da associação\n",this.data.red);

      this.findAll();
      this.user = localStorage.getItem('user');
      this.user = JSON.parse(this.user);
    }

    async findAll() {
      // Consulta ao banco de dados para obter todas as disciplinas disponíveis
      const responseDisciplinas = await this.disciplinaservice.getDisciplina();
      this.disciplinas = responseDisciplinas.data.disciplinas;
    
      // Consulta ao banco de dados para obter os PEEs associados ao RED específico
      try {
        const responsePees = await this.peeService.getPeeByIdRED(this.data.idRED);
        const peesAssociados = responsePees.data.pees;
    
        // Extrai os IDs das disciplinas associadas aos PEEs
        const disciplinasIdsAssociadas = peesAssociados.map((pee: any) => pee.disciplinas_iddisciplinas);
    
        // Filtra as disciplinas associadas
        const disciplinasAssociadas = this.disciplinas.filter(disciplina =>
          disciplinasIdsAssociadas.includes(disciplina.iddisciplinas)
        );
    
        // Atualiza o dataSource2 para exibir as disciplinas já associadas no grupo de baixo
        this.dataSource2 = new MatTableDataSource<disciplina>(disciplinasAssociadas);
    
        // Remove as disciplinas já associadas do grupo de cima
        this.disciplinas = this.disciplinas.filter(disciplina =>
          !disciplinasIdsAssociadas.includes(disciplina.iddisciplinas)
        );
    
        // Atualiza o dataSource para exibir as disciplinas restantes no grupo de cima
        this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
      } catch (error: any) {
        console.error('Erro ao obter PEEs associados:', error);
      }
    }
    

    applyFilter(data: Event) {
      const value = (data.target as HTMLInputElement).value;
      this.dataSource.filter = value;
    }

    selecionarDisciplina(disciplina: any) {
      const disciplinaExistenteIndex = this.disciplinasSelecionadas.findIndex(
        (disciplinaSelecionada) =>
          disciplinaSelecionada.iddisciplinas === disciplina.iddisciplinas
      );
    
      if (disciplinaExistenteIndex === -1) {
        this.disciplinasSelecionadas.push(disciplina);
    
        // Adiciona a nova disciplina ao dataSource2
        this.dataSource2.data.push(disciplina);
        this.dataSource2._updateChangeSubscription();
    
        const index = this.disciplinas.findIndex(
          (item) => item.iddisciplinas === disciplina.iddisciplinas
        );
        if (index >= 0) {
          this.disciplinas.splice(index, 1);
          this.dataSource = new MatTableDataSource<disciplina>(this.disciplinas);
        }
      } else {
        this.snackBarService.open('Esta disciplina já foi associada');
      }
    }
    
    
   async removerDisciplina(disciplina: any) {
    const index = this.disciplinasSelecionadas.findIndex(
        (item) => item.iddisciplinas === disciplina.iddisciplinas
    );
    if (index >= 0) {
        this.disciplinasSelecionadas.splice(index, 1);

        // Remove a disciplina do dataSource2
        this.dataSource2.data = this.dataSource2.data.filter(
            (item: any) => item.iddisciplinas !== disciplina.iddisciplinas
        );

        // Adiciona a disciplina removida de volta ao grupo de cima
        this.disciplinas.push(disciplina);
        this.dataSource.data = [...this.disciplinas]; // Atualiza o dataSource
    } else {
        // Se a disciplina já estava associada anteriormente, precisamos removê-la dos PEEs
        const peeComDisciplina = this.data.red.pee.find(
            (pee: any) => pee.disciplinas_iddisciplinas === disciplina.iddisciplinas
        );
        if (peeComDisciplina) {
            try {
                await this.peeService.deletePee(peeComDisciplina.idpee);
                
                // Remove a disciplina do dataSource2
                this.dataSource2.data = this.dataSource2.data.filter(
                    (item: any) => item.iddisciplinas !== disciplina.iddisciplinas
                );

                // Adiciona a disciplina removida de volta ao grupo de cima
                this.disciplinas.push(disciplina);
                this.dataSource.data = [...this.disciplinas]; // Atualiza o dataSource
            } catch (error: any) {
                console.error('Erro ao remover PEE:', error);
            }
        }
    }
}    

    async cadastrar() {
      try {
        for (const item of this.disciplinasSelecionadas) {
          await this.peeService.createPee({
            conteudo: '',
            metodologia: '',
            trabalhos: '',
            bibliografia: '',
            criterios: '',
            prazofinal: new Date(),
            RED_idRED: this.data.idRED,
            disciplinas_iddisciplinas: item.iddisciplinas,
            pee_servidor: null,
            percentualabono: -1,
            situacao: "Aguardando Associação de Professor"
          });
          // altera situação red
          try {
            let response = await this.redService.updateRed({
              idRED: this.data.idRED,
              situacao: 'Em andamento',
            });
          } catch (error: any) {
            if (error && error.error && error.error.data) {
              const errorMessage = error.error.data;
              this.snackBarService.open(`Falha ao alterar situação da RED: ${errorMessage}`);
            } else {
              this.snackBarService.open('Falha ao alterar situação da RED');
            }
          }
        }
        this.snackBarService.open('Disciplinas associadas com sucesso!!');
        this.dialog.close();
      } catch (error: any) {
        if (error && error.error && error.error.data) {
          const errorMessage = error.error.data;
          this.snackBarService.open(`Falha ao associar Disciplina: ${errorMessage}`);
        } else {
          this.snackBarService.open('Falha ao associar Disciplina');
        }
      }
    }

    cancelar() {
      this.dialog.close();
    }

    apresentarAluno(){
      return `Aluno: ${this.data.red.aluno.nome} - ${this.data.red.aluno.prontuario}`
    }
  }
