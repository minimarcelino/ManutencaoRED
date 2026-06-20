import express from "express";
import { AuthenticationService } from "../middleware/authentication";
import { redController } from "../controller/redController";
import multer from "multer";
import uploadsConfig from "../config/multer";
import { prisma } from "../../prisma/client";

const router = express.Router();
const authentication = new AuthenticationService();
const redcontroller =  new redController();
const upload = multer(uploadsConfig);

router.get('/all', authentication.validate, redcontroller.getAll);
router.post('/create',authentication.validate, upload.array("arquivos"), redcontroller.Create);
router.post('/update/:id',authentication.validate,  upload.array("arquivos"), redcontroller.Update);
router.put('/update/situacao/:id',authentication.validate,  redcontroller.UpdateSituacao);
router.delete('/delete/:id',authentication.validate, redcontroller.Delete);
router.get('/files/:id', authentication.validate, redcontroller.getFiles); // Nova rota para obter arquivos
router.get("/analise", redcontroller.analiseRED);
router.get('/aluno/:id', async (req,res)=>{

 const id = Number(req.params.id);
 try {
   const reds = await prisma.red.findMany({
     where:{
       aluno_id:id
     }
   });
   res.json(reds);
 } catch(error){
   res.status(500).json({
     erro:error
   });
 }
});

router.get('/aluno/:id', async (req, res) => {

  try {

    const idAluno = Number(req.params.id);
    const reds = await prisma.red.findMany({
      where: {
        aluno_id: idAluno
      },
      include: {
        aluno: true,
        pee: {
          include: {
            disciplinas: true,
            pee_servidor: {
              include: {
                servidor: true
              }
            }
          }

        },
        servidor: true
      }
    });
    res.status(200).json(reds);
  } catch(error) {
    console.log(error);
    res.status(500).json({
      erro:"Erro ao buscar REDs do aluno"
    });
  }
});

export default router;
