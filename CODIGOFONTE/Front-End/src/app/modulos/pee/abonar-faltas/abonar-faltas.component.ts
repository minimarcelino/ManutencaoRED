import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PeeService } from 'src/app/services/pee.service';
import { SnackBarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-abonar-falta',
  templateUrl: './abonar-falta.component.html',
  styleUrls: ['./abonar-falta.component.css'],
})
export class AbonarFaltaComponent implements OnInit {


  abonarFaltaPEE!: FormGroup;

  isSubmitting = false;

  user:any;



  constructor(

    private snackBarService: SnackBarService,

    @Inject(MAT_DIALOG_DATA) public data:any,

    private dialog: MatDialogRef<AbonarFaltaComponent>,

    private adapter: DateAdapter<any>,

    @Inject(MAT_DATE_LOCALE) private locale:string,

    private peeService:PeeService

  ){}





  ngOnInit():void{


    this.locale = 'pt-BR';

    this.adapter.setLocale(this.locale);



    this.abonarFaltaPEE = new FormGroup({



      avaliacaoAtividade:new FormControl('',[
        Validators.required
      ]),



      dataEntregaAtividade:new FormControl(null,[
        Validators.required
      ]),



      cumprimento:new FormControl('',[
        Validators.required
      ]),



      novaAtividade:new FormControl('',[
        Validators.required
      ]),



      percentualAbono:new FormControl('',[
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),



      avaliacao:new FormControl('',[
        Validators.required
      ]),



      avaliacaoRealizada:new FormControl(null),



      dataAvaliacao:new FormControl(null)


    });




    this.abonarFaltaPEE
      .get('avaliacao')
      ?.valueChanges
      .subscribe(valor=>{


        const avaliacaoRealizada =
          this.abonarFaltaPEE.get('avaliacaoRealizada');


        const dataAvaliacao =
          this.abonarFaltaPEE.get('dataAvaliacao');



        if(valor === 'Sim'){


          avaliacaoRealizada?.setValidators([
            Validators.required
          ]);



          dataAvaliacao?.setValidators([
            Validators.required
          ]);



        }else{


          avaliacaoRealizada?.clearValidators();

          dataAvaliacao?.clearValidators();



          avaliacaoRealizada?.setValue(null);

          dataAvaliacao?.setValue(null);


        }



        avaliacaoRealizada?.updateValueAndValidity();

        dataAvaliacao?.updateValueAndValidity();


      });





    const userStorage =
      localStorage.getItem('user');


    this.user =
      userStorage
      ? JSON.parse(userStorage)
      : null;


  }







  converterData(data:any){


    if(!data){

      return null;

    }



    // Material Datepicker retorna Date

    if(data instanceof Date){


      const ano = data.getFullYear();

      const mes =
        String(data.getMonth()+1)
        .padStart(2,'0');


      const dia =
        String(data.getDate())
        .padStart(2,'0');



      return `${ano}-${mes}-${dia}`;

    }






    if(typeof data === 'string'){



      // formato DD/MM/YYYY

      if(data.includes('/')){


        const partes = data.split('/');


        const dia = partes[0];

        const mes = partes[1];

        const ano = partes[2];



        return `${ano}-${mes}-${dia}`;

      }





      // formato DDMMYYYY

      if(data.length === 8){


        const dia =
          data.substring(0,2);


        const mes =
          data.substring(2,4);


        const ano =
          data.substring(4,8);



        return `${ano}-${mes}-${dia}`;


      }



    }



    return null;


  }









  async submit(){



    if(
      this.abonarFaltaPEE.invalid ||
      this.isSubmitting
    ){


      this.mostrarErrosFormulario();


      this.abonarFaltaPEE.markAllAsTouched();


      return;

    }





    this.isSubmitting = true;





    try{



      const dadosAtualizacao = {



        editando:true,



        idpee:this.data.idpee,



        situacao:"Avaliado",




        avaliacaoAtividade:
          this.avaliacaoAtividade,




        prazoEntregaAtividade:
          this.data.prazofinal,




        dataEntregaAtividade:
          this.converterData(
            this.dataEntregaAtividade
          ),





        cumpriuAtividade:
          this.cumprimento,




        novaAtividade:
          this.novaAtividade,




        houveAvaliacao:
          this.avaliacao,




        avaliacoesRealizadas:
          this.avaliacaoRealizada,




        dataAvaliacao:
          this.converterData(
            this.dataAvaliacao
          ),




        percentualabono:
          this.percentualAbono


      };





      console.log(
        "ENVIANDO PARA API:",
        dadosAtualizacao
      );





      await this.peeService.updatePee(
        dadosAtualizacao
      );





      this.snackBarService.open(
        'Faltas abonadas com sucesso!'
      );




      this.dialog.close(true);





    }catch(error:any){



      console.log(
        "ERRO UPDATE:",
        error
      );



      this.snackBarService.open(
        'Falha ao abonar as faltas'
      );



    }finally{



      this.isSubmitting = false;


    }



  }









  private mostrarErrosFormulario(){


    const campos =
      this.abonarFaltaPEE.controls;



    if(campos['avaliacaoAtividade'].hasError('required')){


      this.snackBarService.open(
        'A avaliação da atividade é obrigatória.'
      );


      return;

    }



    if(campos['dataEntregaAtividade'].hasError('required')){


      this.snackBarService.open(
        'A data de entrega é obrigatória.'
      );


      return;

    }



    if(campos['cumprimento'].hasError('required')){


      this.snackBarService.open(
        'Informe o cumprimento da atividade.'
      );


      return;

    }



  }







  cancelar(){

    this.dialog.close(false);

  }









  get avaliacaoAtividade(){

    return this.abonarFaltaPEE
      .get('avaliacaoAtividade')
      ?.value || '';

  }




  get dataEntregaAtividade(){

    return this.abonarFaltaPEE
      .get('dataEntregaAtividade')
      ?.value;

  }





  get cumprimento(){

    return this.abonarFaltaPEE
      .get('cumprimento')
      ?.value;

  }





  get novaAtividade(){

    return this.abonarFaltaPEE
      .get('novaAtividade')
      ?.value;

  }





  get percentualAbono(){

    return Number(
      this.abonarFaltaPEE
      .get('percentualAbono')
      ?.value || 0
    );

  }





  get avaliacao(){

    return this.abonarFaltaPEE
      .get('avaliacao')
      ?.value ?? null;

  }





  get avaliacaoRealizada(){

    return this.abonarFaltaPEE
      .get('avaliacaoRealizada')
      ?.value ?? null;

  }





  get dataAvaliacao(){

    return this.abonarFaltaPEE
      .get('dataAvaliacao')
      ?.value ?? null;

  }







  limitarPercentual(event:any){



    let valor =
      Number(event.target.value);




    if(valor > 100){

      valor = 100;

    }



    if(valor < 0){

      valor = 0;

    }



    event.target.value = valor;



    this.abonarFaltaPEE
      .get('percentualAbono')
      ?.setValue(valor);



  }




}