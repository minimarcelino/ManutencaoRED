import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { usuarioNaoAutenticadoService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService} from '../../../services/snackbar.service';
import { ServidorService } from './../../../services/servidor.service';

@Component({
  selector: 'app-trocar-senha',
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.css']
})
export class TrocarSenhaComponent implements OnInit{

  token!: string;
  id!: number;
  senhaForm!: FormGroup;
  hide = true;
  hide2 = true;

  constructor(private route: ActivatedRoute, private usuarioservice: usuarioNaoAutenticadoService,
     private snackBarService: SnackBarService, private servidorservice: ServidorService, private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {

    this.senhaForm = new FormGroup({
      senha: new FormControl('', Validators.required),
      confirmeSenha: new FormControl('', Validators.required),
    });

    this.route.params.subscribe(async params => {
      this.token = params['token'];
      try {
        const response = await this.usuarioservice.getTrocarSenha(this.token);
        this.id = response.data.idservidor;
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    });
  }



  get senha() {
    return this.senhaForm.get('senha')!.value;
  }

  get confirmeSenha() {
    return this.senhaForm.get('confirmeSenha')!.value;
  }

  confirmarSenha(): void {
    const senha = this.senhaForm.get('senha')?.value;
    const confirmeSenha = this.senhaForm.get('confirmeSenha')?.value;
    if (senha === confirmeSenha) {
      this.trocarSenha();
    } else {
      this.snackBarService.open('Senhas diferentes!');
    }
  }

  async trocarSenha(){
    const response = await this.servidorservice.alterarSenha(this.id, this.token, this.senha);
    if(response){
      this.snackBarService.open('Senha Alterada com Sucesso!');
      this.router.navigate([`/`]);
    }else{
      this.snackBarService.open('Erro ao Alterar a Senha!');
    }
  }


}
