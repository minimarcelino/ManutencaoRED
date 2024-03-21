import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { storageService } from './storage.service';
import { authenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class authorizationService {
  user: any;
  constructor(
    private router: Router,
    private storage: storageService,
    private authentication: authenticationService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const token = await this.authentication.getToken();
    this.user = localStorage.getItem('user');

    if (this.user != null) {
      let userType;
      this.user = JSON.parse(this.user);
      // Verifique a rota atual
      const currentRoute = state.url;

      if (token && this.user) {
        // Obtenha o nível de acesso do usuário atual
        const userAccessLevel = this.user.tiposervidor;

        // Verifique o nível de acesso e a rota atual
        if (
          userAccessLevel === 'coordenador' &&
          (currentRoute === '/coordenador' ||
            currentRoute === '/coordenador/perfil' ||
            // Disciplinas
            currentRoute === '/coordenador/listarDisciplinas' ||
            currentRoute === '/coordenador/cadastrarDisciplina' ||
            // Curso
            currentRoute === '/coordenador/listarCurso' ||
            currentRoute === '/coordenador/cadastrarCurso' ||
            //RED
            currentRoute === '/coordenador/cadastrar' ||
            currentRoute === '/coordenador/listar' ||
            currentRoute === '/coordenador/listarRed' ||
            //PEE
            currentRoute === '/coordenador/listarPee' ||
            currentRoute === '/coordenador/listarMeusPees')
        ) {
          return true;
        } else if (
          userAccessLevel === 'cra' &&
          (currentRoute === '/cra' ||
            currentRoute === '/cra/perfil' ||
            // RED
            currentRoute === '/cra/processo-red' ||
            currentRoute === '/cra/listar' ||
            currentRoute === '/cra/cadastrar' ||
            currentRoute === '/cra/listarRed')
          // Alunos
        ) {
          return true;
        } else if (
          userAccessLevel === 'csp' &&
          (currentRoute === '/csp' ||
            currentRoute === '/csp/perfil' ||
            // RED
            currentRoute === '/csp/listar' ||
            currentRoute === '/csp/cadastrar' ||
            currentRoute === '/csp/listarRed' ||
            // Docentes
            currentRoute === '/csp/docentes' ||
            currentRoute === '/csp/cadastrarDocentes')
          // Cursos
        ) {
          return true;
        } else if (
          // O que é docente e o que é professor????
          userAccessLevel === 'docente' &&
          (currentRoute === '/docente' ||
            // Falta perfil
            currentRoute === '/docente/outra-rota-convidado')
          // PEE
        ) {
          return true;
        } else if (
          userAccessLevel === 'administrador' &&
          (currentRoute === '/administrador' ||
            currentRoute === '/administrador/perfil' ||
            // Disciplinas
            currentRoute === '/administrador/listarDisciplinas' ||
            currentRoute === '/administrador/cadastrarDisciplina' ||
            // RED
            currentRoute === '/administrador/listarReds' ||
            // Docentes
            currentRoute === '/administrador/listarDocentes' ||
            currentRoute === '/administrador/cadastrarDocente' ||
            // Alunos
            currentRoute === '/administrador/listarAlunos' ||
            currentRoute === '/administrador/cadastrarAluno' ||
            // Curso
            currentRoute === '/administrador/listarCursos' ||
            currentRoute === '/administrador/cadastrarCurso')
          //PEE
        ) {
          return true;
        } else if (
          userAccessLevel === 'professor' &&
          (currentRoute === '/professor' ||
            currentRoute === '/professor/perfil' ||
            //PEE
            currentRoute === '/professor/listarPees' ||
            currentRoute === '/professor/listarPeesAbonados')
        ) {
          return true;
        }
      }
    }
    this.router.navigate(['login']);
    return false;
  }
}
