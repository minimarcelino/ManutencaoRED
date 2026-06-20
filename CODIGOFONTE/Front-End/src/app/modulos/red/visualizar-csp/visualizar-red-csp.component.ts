import { Location, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx-js-style';

import { messageDialog } from 'src/app/services/messageDialog.service';
import { PeeService } from 'src/app/services/pee.service';

@Component({
  selector: 'app-visualizar-red-csp',
  templateUrl: './visualizar-red-csp.component.html',
  styleUrls: ['./visualizar-red-csp.component.css'],
})
export class CSPVisualizarREDComponent implements OnInit {
  user: any;
  pee: any[] = [];
  dataSource: any;
  private idRED: any;
  private aluno: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'Disciplina',
    'Professor',
    'Comunicacao',
    'DataEnvio',
    'DataLimite',
    'Abono',
    'DataEntrega',
    'Cumprimento',
    'AtividadeAvaliativa',
    'AtividadeAvaliativaRealizadas',
    'DataAvaliacao',
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogQuestionService: messageDialog,
    private peeService: PeeService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.activatedRoute.paramMap.subscribe((params) => {
      if (window.history.state) {
        this.idRED = window.history.state.idRED;
        this.aluno = window.history.state.aluno;
      }
    });
    this.findAll();
  }

  async findAll() {
    const pees = await this.peeService.getPeeByIdRED(this.idRED);
    this.pee = pees.data.pees;
    console.log(this.pee);
    this.dataSource = new MatTableDataSource<any>(this.pee);
    this.dataSource.paginator = this.paginator;
  }

  formatData(Data: Date): string {
    if (Data) {
      return formatDate(Data, 'dd/MM/yyyy', 'pt-BR', 'UTC');
    } else {
      return '';
    }
  }

  apresentarAluno() {
    return this.aluno?.nome || '';
  }

  voltar() {
    this.location.back();
  }

  apresentarAbono(abono: number) {
    return abono < 0 ? "Não avaliado" : `${abono} %`;
  }

  apresentarDocentes(pee: any) {
    return pee.pee_servidor.length > 0
      ? `${pee.pee_servidor.map((docente: any) => docente.servidor.nome).join(', ')}`
      : ' - ';
  }

  imprimir() {
    const printableContent = document.querySelector('.impressao')!.innerHTML;
    const printWindow = window.open('Acompanhamento RED', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
        <link rel="stylesheet" type="text/css" href="./impressao.css">
          <title>Impressão</title>
          <style> .impressao {height: 100%;width: 100%;margin: 20px;}h1, h2 {color: black;padding-top: 10px;}mat-dialog-container {min-width: 85%;min-height: 85%;}.listagem {margin: 15px;}.corpo {margin: 5px;width: 100%;height: 100%;padding-bottom: 5px;}.button, #imprimir {margin: 15px;padding: 10px; max-height: 40px; max-width:75px}.table {margin-right: 10px;border-collapse: separate;border-spacing: 10px;}td, th {border: 10px;padding: 10px;border: 1px solid black }</style>
        </head>
        <body>${printableContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Falha ao abrir a janela de impressão');
    }
  }

  exportarExcel() {


  const wb = XLSX.utils.book_new();

  const ws:any = {};



  function criarCelula(ref:string, valor:any){

    ws[ref] = {

      v: valor,

      s:{}

    };

  }



  const red = this.pee[0];




  // =====================================
  // CABEÇALHO
  // =====================================


  criarCelula(
    "A1",
    "Regime de Exercícios Domiciliares (RED)"
  );


  criarCelula(
    "A2",
    "Relatório de acompanhamento das ações"
  );



  criarCelula(
    "A3",
    "Curso: " + 
    (red?.disciplinas?.curso?.nomeCurso || "")
  );


  criarCelula(
    "A4",
    "Termo: " +
    (this.aluno?.termo || "")
  );


  criarCelula(
    "A5",
    "Aluno: " +
    (this.aluno?.nome || "")
  );


  criarCelula(
    "A6",
    "Prontuário: " +
    (this.aluno?.prontuario || "")
  );




  criarCelula(
    "I3",
    "Processo SUAP: " +
    (this.aluno?.processo || "")
  );


  criarCelula(
    "I4",
    "Data envio RED: " +
    this.formatData(red?.dataEnvioProposta)
  );


  criarCelula(
    "I5",
    "Prazo final: " +
    this.formatData(red?.prazofinal)
  );


  criarCelula(
    "I6",
    "Término RED: " +
    this.formatData(red?.prazoEntregaAtividade)
  );







  // =====================================
  // CABEÇALHO DA TABELA
  // =====================================



  const cabecalho = [


    "Disciplina",

    "Professor",

    "Descrição das atividades propostas",

    "Data do envio",

    "Canal de comunicação",

    "Data limite para aluno",

    "Data do envio da atividade",

    "Aluno cumpriu",

    "Abono",

    "Houve atividade avaliativa?",

    "Avaliações realizadas",

    "Data Avaliação"


  ];




  cabecalho.forEach((valor,index)=>{


    criarCelula(

      XLSX.utils.encode_cell({

        r:7,

        c:index

      }),

      valor

    );


  });







  // =====================================
  // DADOS
  // =====================================



  this.pee.forEach((pee:any,index:number)=>{


    const linha = index + 8;



    const dados = [


      pee.disciplinas?.nomeDisciplina || "",


      pee.pee_servidor?.length > 0

      ?

      pee.pee_servidor
      .map((p:any)=>p.servidor.nome)
      .join(", ")

      :

      "-"



      ,



      pee.conteudo || "",



      this.formatData(
        pee.dataEnvioProposta
      ),



      pee.canalComunicacao || "",



      this.formatData(
        pee.prazofinal
      ),



      this.formatData(
        pee.dataEntregaAtividade
      ),



      pee.cumpriuAtividade || "",



      pee.percentualabono + "%",



      pee.houveAvaliacao || "",



      pee.avaliacoesRealizadas || "",



      this.formatData(
        pee.dataAvaliacao
      )



    ];




    dados.forEach((valor,coluna)=>{


      criarCelula(

        XLSX.utils.encode_cell({

          r:linha,

          c:coluna

        }),

        valor

      );


    });



  });








  // =====================================
  // OBSERVAÇÕES
  // =====================================


  const linhaObs = this.pee.length + 10;



  criarCelula(
    `A${linhaObs}`,
    "Observações"
  );



  criarCelula(
    `A${linhaObs+1}`,
    "1 - A entrega e cumprimento das atividades pelo aluno abona faltas do período."
  );



  criarCelula(
    `A${linhaObs+2}`,
    "2 - Atividades do RED não devem ser avaliativas, mas de estudos."
  );



  criarCelula(
    `A${linhaObs+3}`,
    "3 - Atividades avaliativas ocorridas no período de afastamento do aluno deverão ser aplicadas após o retorno do RED."
  );







  // =====================================
  // MESCLAGEM
  // =====================================



  ws["!merges"]=[


    // titulo

    {
      s:{r:0,c:0},
      e:{r:0,c:11}
    },


    {
      s:{r:1,c:0},
      e:{r:1,c:11}
    },



    // dados aluno


    {
      s:{r:2,c:0},
      e:{r:2,c:7}
    },


    {
      s:{r:3,c:0},
      e:{r:3,c:7}
    },


    {
      s:{r:4,c:0},
      e:{r:4,c:7}
    },


    {
      s:{r:5,c:0},
      e:{r:5,c:7}
    },



    // processo


    {
      s:{r:2,c:8},
      e:{r:2,c:11}
    },


    {
      s:{r:3,c:8},
      e:{r:3,c:11}
    },


    {
      s:{r:4,c:8},
      e:{r:4,c:11}
    },


    {
      s:{r:5,c:8},
      e:{r:5,c:11}
    },




    // observações


    {
      s:{r:linhaObs-1,c:0},
      e:{r:linhaObs-1,c:11}
    },


    {
      s:{r:linhaObs,c:0},
      e:{r:linhaObs,c:11}
    },


    {
      s:{r:linhaObs+1,c:0},
      e:{r:linhaObs+1,c:11}
    },


    {
      s:{r:linhaObs+2,c:0},
      e:{r:linhaObs+2,c:11}
    },


    {
      s:{r:linhaObs+3,c:0},
      e:{r:linhaObs+3,c:11}
    }



  ];









  // =====================================
  // TAMANHO
  // =====================================


  ws["!cols"]=[


    {wch:22},

    {wch:25},

    {wch:60},

    {wch:16},

    {wch:25},

    {wch:18},

    {wch:22},

    {wch:15},

    {wch:12},

    {wch:24},

    {wch:22},

    {wch:18}


  ];



  ws["!rows"]=[


    {hpt:30},

    {hpt:22},

    {hpt:22},

    {hpt:22},

    {hpt:22},

    {hpt:22},

    {hpt:35},

    {hpt:60}


  ];










  // =====================================
  // ESTILO BASE
  // =====================================



  Object.keys(ws).forEach(ref=>{


    if(ref.startsWith("!"))
      return;



    ws[ref].s={


      alignment:{


        horizontal:"center",

        vertical:"center",

        wrapText:true


      },


      border:{


        top:{
          style:"thin"
        },


        bottom:{
          style:"thin"
        },


        left:{
          style:"thin"
        },


        right:{
          style:"thin"
        }



      },


      font:{


        name:"Arial",

        sz:10


      }



    };



  });









  // =====================================
  // CORES
  // =====================================



  ws["A1"].s.fill={

    fgColor:{
      rgb:"C99700"
    }

  };


  ws["A1"].s.font={

    bold:true,

    sz:16

  };





  ws["A2"].s.fill={

    fgColor:{
      rgb:"FFE599"
    }

  };


  ws["A2"].s.font={

    bold:true,

    sz:12

  };






  // dados superiores


  [

    "A3","A4","A5","A6",

    "I3","I4","I5","I6"

  ].forEach(ref=>{


    ws[ref].s.fill={


      fgColor:{
        rgb:"FCE5CD"
      }


    };


    ws[ref].s.font={

      bold:true

    };


  });








  // cabeçalho tabela


  for(let c=0;c<12;c++){


    const ref = XLSX.utils.encode_cell({

      r:7,

      c:c

    });


    ws[ref].s.fill={

      fgColor:{
        rgb:"C99700"
      }

    };


    ws[ref].s.font={

      bold:true

    };


  }







  // dados tabela


  for(let r=8;r<this.pee.length+8;r++){


    for(let c=0;c<12;c++){


      const ref=XLSX.utils.encode_cell({

        r:r,

        c:c

      });


      ws[ref].s.fill={


        fgColor:{
          rgb:"FFE599"
        }


      };



    }


  }






  // observações


  for(let r=linhaObs;r<=linhaObs+3;r++){


    const ref=`A${r}`;


    ws[ref].s.fill={


      fgColor:{
        rgb:"FFE599"
      }


    };


  }




  ws["!ref"] = `A1:L${linhaObs+5}`;





  XLSX.utils.book_append_sheet(

    wb,

    ws,

    "Acompanhamento RED"

  );




  XLSX.writeFile(

    wb,

    "Acompanhamento_RED.xlsx"

  );



}

  
}
