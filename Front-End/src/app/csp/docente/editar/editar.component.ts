import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { docenteService } from 'src/app/services/docente.service';
import { SnackBarComponent } from 'src/app/utils/snack-bar/snack-bar.component';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarDocenteComponent implements OnInit{

  cadastrarDocente!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;
  mostrarCampo: boolean = false;
  tipoServidores: string[] = ["administrador", "professor", "coordenador", "cra", "csp"];

  constructor(private snackBar: MatSnackBar, private router: Router, private docenteservice: docenteService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<EditarDocenteComponent>){}

  ngOnInit(): void {
    this.user = localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    if(this.user.tiposervidor == 'administrador'){
      this.mostrarCampo = true;
      this.cadastrarDocente = new FormGroup({
        prontuario: new FormControl(this.data.prontuario, [Validators.required]),
        nome: new FormControl(this.data.nome, [Validators.required]),
        email: new FormControl(this.data.email, [Validators.required]),
        tiposervidor: new FormControl(this.data.tiposervidor, [Validators.required]),
      });
    } else {
      this.cadastrarDocente = new FormGroup({
        prontuario: new FormControl(this.data.prontuario, [Validators.required]),
        nome: new FormControl(this.data.nome, [Validators.required]),
        email: new FormControl(this.data.email, [Validators.required]),
      });
    }
    console.log(this.data);
  }

  async submit() {
    if (this.cadastrarDocente.invalid || this.isSubmitting) {
      this.openSnackBar("Campos Obrigatórios", null);
      return;
    } else {
      this.isSubmitting = true;
      if(this.user.tiposervidor == 'administrador'){
        try {
          await this.docenteservice.updateDocente({
            idservidor: this.data.idservidor,
            prontuario: this.prontuario.toUpperCase(),
            nome: this.nome,
            email: this.email,
            tiposervidor: this.tiposervidor,
            senha: this.data.senha,
          }); 
          this.openSnackBar("Docente editado com sucesso!!", null);
        } catch (error: any) {
          if (error && error.error && error.error.data) {
            const errorMessage = error.error.data;
            this.openSnackBar("Falha ao editar docente", errorMessage);
          } else {
            this.openSnackBar("Falha ao editar docente", "Ocorreu um erro durante a edição do docente.");
          }
        }
      } else {
        try {
          await this.docenteservice.updateDocente({
            idservidor: this.data.idservidor,
            prontuario: this.prontuario.toUpperCase(),
            nome: this.nome,
            email: this.email,
            tiposervidor: this.data.tiposervidor,
            senha: this.data.senha,
          }); 
          this.openSnackBar("Docente editado com sucesso!!", null);
        } catch (error: any) {
          if (error && error.error && error.error.data) {
            const errorMessage = error.error.data;
            this.openSnackBar("Falha ao editar docente", errorMessage);
          } else {
            this.openSnackBar("Falha ao editar docente", "Ocorreu um erro durante a edição do docente.");
          }
        }
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

  get prontuario(){
    return this.cadastrarDocente.get('prontuario')!.value;
  }

  get nome() {
    return this.cadastrarDocente.get('nome')!.value;
  }

  get email() {
    return this.cadastrarDocente.get('email')!.value;
  }

  get tiposervidor() {
    return this.cadastrarDocente.get('tiposervidor')!.value;
  }

}
