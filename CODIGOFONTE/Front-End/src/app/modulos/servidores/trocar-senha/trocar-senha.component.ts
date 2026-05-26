import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { usuarioNaoAutenticadoService } from 'src/app/services/usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../services/snackbar.service';
import { ServidorService } from './../../../services/servidor.service';

@Component({
  selector: 'app-trocar-senha',
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.css']
})
export class TrocarSenhaComponent implements OnInit {

  token!: string;
  id!: number;
  senhaForm!: FormGroup;

  hide = true;
  hide2 = true;

  constructor(
    private route: ActivatedRoute,
    private usuarioservice: usuarioNaoAutenticadoService,
    private snackBarService: SnackBarService,
    private servidorservice: ServidorService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {

    this.senhaForm = new FormGroup({
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmeSenha: new FormControl('', Validators.required),
    });

    this.route.params.subscribe(async params => {
      this.token = params['token'];

      try {
        const response = await this.usuarioservice.getTrocarSenha(this.token);
        this.id = response.data.idservidor;
      } catch (error) {
        console.error('Erro ao obter dados:', error);
        this.snackBarService.open('Token inválido ou expirado!');
        this.router.navigate(['/']);
      }
    });
  }

  get senha() {
    return this.senhaForm.get('senha')!;
  }

  get confirmeSenha() {
    return this.senhaForm.get('confirmeSenha')!;
  }

  confirmarSenha(): void {

    if (this.senhaForm.invalid) {
      this.senhaForm.markAllAsTouched();
      return;
    }

    if (this.senha.value !== this.confirmeSenha.value) {
      this.confirmeSenha.setErrors({ mismatch: true });
      this.snackBarService.open('As senhas não coincidem!');
      return;
    }

    this.trocarSenha();
  }

  async trocarSenha() {
    try {
      const response = await this.servidorservice.alterarSenha(
        this.id,
        this.token,
        this.senha.value
      );

      if (response) {
        this.snackBarService.open('Senha alterada com sucesso!');
        this.router.navigate(['/']);
      } else {
        this.snackBarService.open('Erro ao alterar a senha!');
      }

    } catch (error) {
      this.snackBarService.open('Erro inesperado!');
    }
  }

  // ✅ BOTÃO CANCELAR AJUSTADO
  cancelar(): void {
    this.senhaForm.reset(); // limpa o formulário (boa prática)
    this.router.navigate(['/']); // redireciona (ajuste se quiser outra rota)
  }
}