import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-processo-red',
  templateUrl: './processo-red.component.html',
  styleUrls: ['./processo-red.component.css']
})
export class ProcessoREDComponent {
  constructor(private router: Router) { }

  displayFn(aluno: any): string {
    return aluno && aluno.nome;
  }

  InputFile(event: any) {

    if (event.target.files && event.target.files[0]) {
      const pdf = event.target.files[0];
      const formData = new FormData();
      formData.append('pdf', pdf);
    }
  }

  teste(){
    this.router.navigate(['/cra'])
    console.log("funcionou");
  }
  
}