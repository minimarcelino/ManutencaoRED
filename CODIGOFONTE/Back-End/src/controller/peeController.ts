import { Request, Response } from 'express';
import { peeService } from '../service/peeService';
import { StatusCodes } from 'http-status-codes';
import { emailController } from './emailController';
import { redController } from './redController';

const peeservice = new peeService();
const redcontroller = new redController();
const emailcontroller = new emailController();


export class PeeController {


  async getPees(req: Request, res: Response) {

    try {

      const { search, page, perPage, orderBy } = req.query;

      const response = await peeservice.findMany(
        String(search),
        Number(page),
        Number(perPage),
        String(orderBy)
      );


      return res.status(
        response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
      ).send(response);


    } catch(error:any){

      return res.status(400).send({
        ok:false,
        error:error.message
      });

    }

  }



  async getAll(req: Request, res: Response) {

    try {

      const response = await peeservice.findAll();


      return res.status(
        response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
      ).send(response);


    } catch(error:any){

      return res.status(400).send({
        ok:false,
        error:error.message
      });

    }

  }



  async getById(req: Request, res: Response) {


    const response = await peeservice.findById(
      Number(req.params.id)
    );


    return res.status(
      response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    ).send(response);

  }



  async getByIdRED(req: Request, res: Response) {


    const response = await peeservice.findByIdRED(
      Number(req.params.id)
    );


    return res.status(
      response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    ).send(response);

  }





  async Create(req: Request, res: Response) {


    try {


      const response = await peeservice.create(req.body);


      if(response.ok){


        if(
          typeof response.data === 'object' &&
          response.data &&
          'RED_idRED' in response.data
        ){


          const idRed = response.data.RED_idRED;


          const redResponse =
          await redcontroller.getById(idRed);


          emailcontroller.SendEmailCoordenadorAssocieProfessor(
            redResponse
          );


        }


      }


      return res.status(
        response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
      ).send(response);



    }catch(error:any){


      console.log(error);


      return res.status(400).send({
        ok:false,
        error:error.message
      });


    }


  }






  async Delete(req: Request,res:Response){


    const response =
    await peeservice.delete(
      Number(req.params.id)
    );


    return res.status(
      response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    ).send(response);


  }







  async Update(req: Request, res: Response) {


    try {


      console.log(
        "ID RECEBIDO:",
        req.params.id
      );


      console.log(
        "BODY RECEBIDO NO UPDATE:",
        req.body
      );



      const response =
      await peeservice.update(
        req.body,
        Number(req.params.id)
      );



      console.log(
        "RESPOSTA UPDATE:",
        response
      );



      if(response.ok){



        if(
          response.data &&
          typeof response.data === "object" &&
          "metodologia" in response.data
        ){


          const data = response.data as {
            metodologia:string;
            RED_idRED:number;
          };



          if(data.metodologia !== ""){


            const redResponse =
            await redcontroller.getById(
              Number(data.RED_idRED)
            );



            emailcontroller.SendEmailCoordenadorFinalizandoRed(
              redResponse
            );



          }else{


  const peeCompleto = await peeservice.findById(
    Number(req.params.id)
  );


  if(peeCompleto.ok){

    emailcontroller.SendEmailProfesorIniciandoPEE(
      peeCompleto.data
    );

  }


}

        }



        return res
        .status(StatusCodes.OK)
        .send(response.data);



      }



      return res
      .status(StatusCodes.BAD_REQUEST)
      .send(response);



    }catch(error:any){


      console.log(
        "ERRO UPDATE PEE:",
        error
      );



      return res.status(400).send({

        ok:false,

        error:{
          message:error.message,
          name:error.name
        }

      });


    }


  }


async getByProfessor(req: Request, res: Response){

  const response = await peeservice.findByProfessor(
    Number(req.params.id)
  );


  return res.status(
    response.ok 
      ? StatusCodes.OK 
      : StatusCodes.BAD_REQUEST
  ).send(response);

}




  async UpdateWithEmail(
    req:Request,
    res:Response
  ){


    try{


      const response =
      await peeservice.update(
        req.body,
        Number(req.params.id)
      );



      if(response.ok){



        if(
          response.data &&
          typeof response.data === "object" &&
          "RED_idRED" in response.data
        ){


          const RED_idRED =
          Number(response.data.RED_idRED);



          const redAluno =
          (
            await redcontroller.getById(RED_idRED)
          ).data;



          emailcontroller.sendEmailAluno(
            redAluno,
            req
          );


        }



      }



      return res.status(
        response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
      ).send(response);



    }catch(error:any){


      return res.status(400).send({

        ok:false,

        error:error.message

      });


    }


  }

  async findByProfessor(req: Request, res: Response) {

    try {

      const idservidor = Number(req.params.idservidor);


      const response = await peeservice.findByProfessor(
        idservidor
      );


      return res.status(
        response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
      ).send(response);


    } catch(error:any) {


      console.log(error);


      return res.status(400).send({

        ok:false,

        error:error.message

      });


    }

  }
  
  async getByHash(req:Request,res:Response){


    const response =
    await peeservice.findByHash(
      req.params.hash
    );



    return res.status(
      response.ok ? StatusCodes.OK : StatusCodes.BAD_REQUEST
    ).send(response);


  }



}