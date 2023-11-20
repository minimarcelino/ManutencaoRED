import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { pee } from 'src/app/modelo/pee';
import { messageDialog } from 'src/app/services/messageDialog.service';
import { peeService } from 'src/app/services/pee.service';
import { CadastrarPeeComponent } from '../cadastrar-pee/cadastrar-pee.component';
import { AbonarFaltaComponent } from '../abonar-faltas/abonar-faltas.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarPeesComponent implements OnInit {

  pees: pee[] = [];
  user: any = '';
  dataSource: any;
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  displayedColumns = ['disciplina', 'nome', 'prontuario', 'email', 'acoes'];

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
    this.pees = this.pees.filter(pee => pee.percentualabono == 0);
    this.dataSource = new MatTableDataSource<pee>(this.pees);
    this.dataSource.paginator = this.paginator;
    console.log(this.pees);
  }

  abonarFalta(pee: any){
    const editar = this.dialog.open(AbonarFaltaComponent, {
      data: {
        idpee: pee.idpee, RED_idRED: pee.RED_idRED, disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas, servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono, aluno_prontuario: pee.red.aluno.prontuario, nome_aluno: pee.red.aluno.nome, prazofinal: pee.prazofinal, conteudo: pee.conteudo,
        metodologia: pee.metodologia, trabalhos: pee.trabalhos, bibliografia: pee.bibliografia, criterios: pee.criterios, dataEnvioProposta: pee.dataEnvioProposta,
        canalComunicacao: pee.canalComunicacao, houveAvaliacao: pee.houveAvaliacao, avaliacoesRealizadas: pee.avaliacoesRealizadas, dataAvaliacao: pee.dataAvaliacao,
        observacao: pee.observacao, 
      }
    });
    this.handleDialogConfirm(editar);
  }


  applyFilter(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  adicionarPee(pee: pee) {
    const editar = this.dialog.open(CadastrarPeeComponent, {
      data: {
        idpee: pee.idpee, RED_idRED: pee.RED_idRED, disciplinas_iddisciplinas: pee.disciplinas_iddisciplinas, servidor_idservidor: pee.servidor_idservidor,
        percentualabono: pee.percentualabono
      }
    });
    this.handleDialogConfirm(editar);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe((result: string) => {
      this.findAll();
    });
  }


}