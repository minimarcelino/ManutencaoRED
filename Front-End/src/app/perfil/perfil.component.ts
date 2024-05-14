import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServidorService } from '../services/servidor.service';
import { SnackBarService } from '../services/snackbar.service';
import { SenhaComponent } from './alterar-senha/senha.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  alterarPerfil!: FormGroup; // Adicionando "!" para indicar que será inicializado no construtor
  user: any;
  editing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackBarService,
    private servidorService: ServidorService
  ) {}


  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.alterarPerfil = new FormGroup({
      nome: new FormControl({ value: this.user.nome, disabled: true }, [Validators.required,]),
      prontuario: new FormControl({ value: this.user.prontuario, disabled: true },[Validators.required]),
      email: new FormControl({ value: this.user.email, disabled: true }, [Validators.required,]),
    });
    
  }

  toggleEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }

  async alterarSenha() {
    const senha = this.dialog.open(SenhaComponent, {

    });
    this.handleDialogConfirm(senha);
  }

  handleDialogConfirm(dialog: any) {
    dialog.afterClosed().subscribe(() => {
      
    });
  }
}
