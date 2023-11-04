import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { servidorService } from 'src/app/services/servidor.service';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css']
})
export class DisciplinasComponent implements OnInit{
  dataToImport: any;
  data: any[] = [];

  constructor(private http: HttpClient, private servidorService: servidorService) {}
 

  ngOnInit() {
  }

  onFileChange(event: any) {
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
      this.data = data.map((item: any) => {
        const componente = item["Componente"];
        const nomeSplit = componente.split(" - ");
        
        if (nomeSplit.length === 2) {
          const nome = nomeSplit[1];
          const sigla = item["Sigla"];
          const regexSiglaResult = /\((.*?)\)/.exec(sigla);
          const dentroParenteses = regexSiglaResult ? regexSiglaResult[1] : null;
      
          return {
            sigla: dentroParenteses,
            curso_idcurso: 1,
            nomedisciplina: nome
          };
        } else {
          return {
            sigla: null,
            curso_idcurso: 1,
            nomedisciplina: "Nome não encontrado"
          };
        }
      });
      this.data.forEach(item =>
        this.servidorService.exportDisciplina(item)
      );
    };
  }
}
