import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';

import { ServidorService } from 'src/app/services/servidor.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EntityUpdateService } from 'src/app/services/entityUpdate.service';

@Component({
  selector: 'app-formulario-servidor',
  templateUrl: './formulario-servidor.component.html',
  styleUrls: ['./formulario-servidor.component.css'],
})
export class FormularioServidoresComponent implements OnInit {
  formularioServidor!: FormGroup;
  cursos: any[] = [];
  isSubmitting: boolean = false;
  error: Error | null = null;
  user: any;
  servidores: any[] = [];
  servidor: any;
  tipoServidores: string[] = [
    'administrador',
    'professor',
    'coordenador',
    'cra',
    'csp',
  ];
  private data: any;
  private editar: boolean = false;
  private desabilitar: boolean = false;
  private cadastrar: boolean = false;

  constructor(
    private servidorService: ServidorService,
    private entityUpdateService: EntityUpdateService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private location: Location,
  ) {}

  ngOnInit(): void {
    let pront = '';
    this.activatedRoute.paramMap.subscribe(() => {
      if (window.history.state) {
        this.data = window.history.state.servidor;
        this.desabilitar = window.history.state.visualizar;
      }
    });

    if (this.data != null) {
      this.editar = true;
      pront = String(this.data.prontuario);
    }

    if(this.data == null)
    {
        this.cadastrar = true;
    }


    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);

    this.formularioServidor = new FormGroup({
      prontuario: new FormControl(
        {
          valeu: this.data ? String(this.data.prontuario) : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      nome: new FormControl(
        {
          value: this.data ? this.data.nome : '',
          disabled: this.desabilitar,
        },
        [Validators.required]
      ),
      email: new FormControl(
        {
          value: this.data ? this.data.email : '',
          disabled: this.desabilitar,
        },
        [Validators.required, Validators.email]
      ),
      tiposervidor: new FormControl({
        value: this.data ? this.data.tiposervidor : '',
        disabled: this.desabilitar,
      }),
    });

    if (this.data) {
      this.formularioServidor.get('prontuario')?.setValue(String(this.data.prontuario));
    }

    if(this.cadastrar){
      this.buscarServidores();
      this.verificarProntuario();
    }
  }

  async submit() {

  if (this.formularioServidor.invalid || this.isSubmitting) {

    this.mostrarErrosFormulario();

    const fields = Object.keys(this.formularioServidor.controls);

    const firstInvalidField = fields.find(
      (field) => this.formularioServidor.get(field)!.invalid
    );


    if (firstInvalidField) {

      const element = document.getElementById(firstInvalidField);

      if (element) {
        element.focus();
      }

    }

    return;
  }


  if (this.nome.trim() === '') {

    this.snackBarService.open(
      'O nome deve ser preenchido corretamente.'
    );

    document.getElementById('nome')?.focus();

    return;
  }


  if (this.email.trim() === '') {

    this.snackBarService.open(
      'O e-mail deve ser preenchido corretamente.'
    );

    document.getElementById('email')?.focus();

    return;
  }


  try {

    this.isSubmitting = true;


    if (this.editar) {

      await this.updateServidor();

    } else {

      await this.createServidor();

    }


    this.retornarParaLista();


  } catch (error: any) {


    console.error(error);


    const errorData = error?.error?.data;
    const errorPrisma = error?.error?.error;


    if (errorPrisma?.code === 'P2002') {


      const campoErro = errorPrisma.meta['target'][0];


      const mensagensDuplicadas: any = {

        email: 'Este e-mail já está cadastrado',

        cpf: 'Este CPF já está cadastrado'

      };


      this.snackBarService.open(
        mensagensDuplicadas[campoErro] 
        || `Campo ${campoErro} já cadastrado`
      );


    } else if (errorData) {


      this.snackBarService.open(
        `Falha ao cadastrar servidor: ${errorData}`
      );


    } else {


      this.snackBarService.open(
        'Falha ao cadastrar servidor'
      );


    }


  } finally {

    this.isSubmitting = false;

  }

}

private mostrarErrosFormulario() {

  const campos = this.formularioServidor.controls;


  if (campos['nome']?.hasError('required')) {

    this.snackBarService.open(
      'O nome do servidor é obrigatório.'
    );

    return;
  }


  if (campos['nome']?.hasError('minlength')) {

    this.snackBarService.open(
      'O nome deve ter pelo menos 3 caracteres.'
    );

    return;
  }


  if (campos['email']?.hasError('required')) {

    this.snackBarService.open(
      'O e-mail do servidor é obrigatório.'
    );

    return;
  }


  if (campos['email']?.hasError('email')) {

    this.snackBarService.open(
      'Digite um e-mail válido.'
    );

    return;
  }


  this.snackBarService.open(
    'Verifique os campos preenchidos.'
  );

}

  private async createServidor() {
    await this.servidorService.createServidor({
      prontuario: this.prontuario.trim().toUpperCase(),
      nome: this.nome.trim(),
      email: this.email.trim(),
      tiposervidor: this.tiposervidor || 'professor',
      senha: this.gerarPalavraAleatoria(8),
    });
    this.snackBarService.open(`Servidor cadastrado com sucesso`);
  }

  private async updateServidor() {
    let idServidor;
    let senha;
    if(this.cadastrar){
      idServidor = this.servidor.idservidor;
      senha = this.servidor.senha;
    }else{
      idServidor = this.data.idservidor;
      senha = this.data.senha;
    }
    await this.servidorService.updateServidor({
      idservidor: idServidor,
      prontuario: this.prontuario.toUpperCase(),
      nome: this.nome,
      email: this.email,
      tiposervidor: this.tiposervidor,
      senha: senha,
    });
    this.snackBarService.open('Servidor editado com sucesso');
  }

  retornarParaLista() {
    this.entityUpdateService.notifyUpdate('servidor');
    this.location.back();
  }

  get prontuario() {
    return this.formularioServidor.get('prontuario')!.value;
  }

  get nome() {
    return this.formularioServidor.get('nome')!.value;
  }

  get email() {
    return this.formularioServidor.get('email')!.value;
  }

  get tiposervidor() {
    return this.formularioServidor.get('tiposervidor')!.value;
  }

  get editando() {
    return this.editar;
  }

  get desabilitado() {
    return this.desabilitar;
  }

  titulo() {
    let titulo;
    if (!this.editar) {
      titulo = 'Cadastro de Servidor';
    } else {
      titulo = 'Edição de Servidor';
    }
    return titulo;
  }

  isADM() {
    return this.user.tiposervidor === 'administrador';
  }

  gerarPalavraAleatoria(tamanho: number) {
    var letras = 'abcdefghijklmnopqrstuvwxyz@#1234567890';
    var palavra = '';
    for (var i = 0; i < tamanho; i++) {
      var indice = Math.floor(Math.random() * letras.length);
      palavra += letras.charAt(indice);
    }
    return palavra;
  }


  async buscarServidores(): Promise<void> {
    try {
      this.servidores = await this.servidorService.getServidores();
      this.servidores = Object.values(this.servidores);
    } catch (error) {
      console.error('Erro ao carregar os alunos:', error);
    }
  }

  preencherFormulario(servidorData: any) {
    this.formularioServidor.patchValue({
      nome: servidorData.nome,
      email: servidorData.email,
      tiposervidor: servidorData.tiposervidor,
    });
  }
  // Função para limpar o formulário
  esvaziarFormulario() {
    this.formularioServidor.patchValue({
      nome: '',
      email: '',
      tiposervidor: '',
    });
  }

  async verificarProntuarioCadastrada(prontuario: string): Promise<boolean> {
    const listaServidores = this.servidores[1].servidores;
    return listaServidores.some((servidor: any) => servidor.prontuario === prontuario);
  }

  async verificarProntuario(){
        this.formularioServidor.get('prontuario')!.valueChanges.subscribe(async (value) => {
          console.log("entrou")
          if (value) {
            const prontuarioCadastrado = await this.verificarProntuarioCadastrada(value.toUpperCase());
            if (prontuarioCadastrado) {
              this.editar = true;
              const listaServidores = this.servidores[1].servidores;
              this.servidor = listaServidores.find((servidor: any) => servidor.prontuario === value.toUpperCase());
              this.preencherFormulario(this.servidor);
            }
            else{
              if(this.editar == true){
                this.editar = false;
                this.servidor = null;
                this.esvaziarFormulario();
              }
            }
          }
        });
  }
}
