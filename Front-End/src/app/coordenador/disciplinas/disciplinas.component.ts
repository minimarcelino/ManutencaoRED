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
      this.data = data;
      // Send the data to the database
      this.data.forEach(item => 
        this.servidorService.exportDisciplina({
          sigla: item["Sigla"],
          curso_idcurso: 1,
          nomedisciplina: item.Componente
        }))
    };
  }
}
