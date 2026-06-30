import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { redService } from '../service/redService';
import { PrismaClient } from '@prisma/client';
import { emailController } from './emailController';

const prisma = new PrismaClient();
const redservice = new redService();
const emailcontroller = new emailController();

export class redController {
  async getAll(req: Request, res: Response) {
    const response = await redservice.findAll();
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getFiles(req: Request, res: Response) {
    const response = await redservice.findFilesByRedId(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response.data);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response.data);
    }
  }

  async Create(req: Request, res: Response) {
    const redData = JSON.parse(req.body.red);
    const response = await redservice.create(redData);

    console.log('RESPONSE\n', response);
    if (response.ok) {
      emailcontroller.sendEmailCoordenadorInicioRED(response);

      const requestArquivos = req.files as Express.Multer.File[];
      const arquivos = requestArquivos.map((arquivo) => {
        return {
          path: arquivo.filename,
        };
      });

      const redId = response.idRED;
      await prisma.arquivo.createMany({
        data: arquivos.map((arquivo) => ({
          path: arquivo.path,
          red_idRED: redId,
        })),
      });
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Delete(req: Request, res: Response) {
    const response = await redservice.delete(Number(req.params.id));
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async Update(req: Request, res: Response) {
    try {

      const redData = JSON.parse(req.body.red);

      const redId = Number(req.params.id);



      // valida data de juntada dos PEEs (máximo 5 dias)
      if (redData.dataJuntadaPEE) {


        const hoje = new Date();


        const limite = new Date();
        limite.setDate(
          hoje.getDate() + 5
        );


        const dataJuntada = new Date(
          redData.dataJuntadaPEE
        );



        if (dataJuntada > limite) {

          return res.status(
            StatusCodes.BAD_REQUEST
          ).send({

            ok: false,

            message:
              "A data de juntada dos PEEs deve ser no máximo 5 dias."

          });

        }

      }



      const response =
        await redservice.update(
          redData,
          redId
        );



      if (response.ok) {


        /*
          Como dataJuntadaPEE não existe no banco,
          adicionamos novamente no retorno para usar no email
        */
        if (
          response.data &&
          typeof response.data === "object"
        ) {

          (response.data as any).dataJuntadaPEE =
            redData.dataJuntadaPEE;

        }




        // ENVIA EMAIL CSP E CRA
        if (
          response.data &&
          typeof response.data === "object" &&
          'situacao' in response.data
        ) {


          if (
            response.data.situacao ===
            'Esperando associação de disciplina'
          ) {


            await emailcontroller.sendEmailCSP(
              response
            );


            await emailcontroller.SendEmailCRADataJuntadaRED(
              response
            );


          }

        }




        // PROCESSAMENTO DOS ARQUIVOS
        const requestArquivos =
          req.files as Express.Multer.File[];



        if (
          requestArquivos &&
          requestArquivos.length > 0
        ) {


          const arquivos =
            requestArquivos.map((arquivo) => ({

              path: arquivo.filename

            }));



          await prisma.arquivo.createMany({

            data:
              arquivos.map((arquivo) => ({

                path: arquivo.path,

                red_idRED: redId

              }))

          });


        }



        return res.status(
          StatusCodes.OK
        ).send(response);


      }



      return res.status(
        StatusCodes.BAD_REQUEST
      ).send(response);



    } catch (error: any) {


      console.error(
        'Erro ao atualizar RED:',
        error
      );


      return res.status(
        StatusCodes.INTERNAL_SERVER_ERROR
      ).send({

        ok: false,

        error:
          'Erro ao atualizar RED'

      });


    }

  }



  async UpdateSituacao(req: Request, res: Response) {
    const response = await redservice.updateSituacao(req.body);
    if (response.ok) {
      return res.status(StatusCodes.OK).send(response);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send(response);
    }
  }

  async getById(id: number) {
    const response = await redservice.findById(id);
    return response;
  }

  async analiseRED(req: Request, res: Response) {
    try {

      const response = await redservice.analiseRED();

      return res.status(StatusCodes.OK).send(response);

    } catch (error) {

      console.error("Erro na análise de REDs:", error);

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          message: "Erro ao buscar análise de REDs"
        });

    }
  }
}
