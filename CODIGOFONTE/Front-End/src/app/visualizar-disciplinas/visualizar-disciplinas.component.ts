import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-visualizar-disciplinas',
  templateUrl: './visualizar-disciplinas.component.html',
  styleUrls: ['./visualizar-disciplinas.component.css']
})
export class VisualizarDisciplinasComponent implements OnInit {

  idRED!: number;

  displayedColumns: string[] = ['professor', 'sigla', 'nome', 'situacao'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idRED = Number(id);
      console.log('ID RED:', this.idRED);

      this.carregarDisciplinas();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  carregarDisciplinas() {
    // 🔥 MOCK (depois você troca pela API)
    const disciplinas = [
      { professor: 'João', sigla: 'MAT', nome: 'Matemática', situacao: 'Ativa' },
      { professor: 'Maria', sigla: 'PORT', nome: 'Português', situacao: 'Ativa' }
    ];

    this.dataSource.data = disciplinas;
  }

  voltar() {
  this.router.navigate(['/administrador/listarREDs']);
  }

}