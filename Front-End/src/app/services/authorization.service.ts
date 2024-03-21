import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot } from '@angular/router';
import { storageService } from './storage.service';
import { authenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
  })
  export class authorizationService {
    user: any;
    constructor(
        private router: Router,
        private storage: storageService,
        private authentication: authenticationService
      ) {}

      async canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
          const token = await this.authentication.getToken();
          this.user = localStorage.getItem("user");

          if(this.user != null){
            this.user = JSON.parse(this.user);
             // Verifique a rota atual
            const currentRoute = state.url;

            if (token && this.user) {
              // Obtenha o nível de acesso do usuário atual
              const userAccessLevel = this.user.tiposervidor;

              // Verifique o nível de acesso e a rota atual
              if (userAccessLevel === 'coordenador' && (currentRoute === '/coordenador' ||
                                                        currentRoute === '/coordenador/discipinas' ||
                                                        currentRoute === '/coordenador/listarCurso' ||
                                                        currentRoute === '/coordenador/cadastrarCurso' ||
                                                        currentRoute === '/coordenador/cadastrar' ||
                                                        currentRoute === '/coordenador/listar' ||
                                                        currentRoute === '/coordenador/listarRed' ||
                                                        currentRoute === '/coordenador/cadastrarDisciplina' ||
                                                        currentRoute === '/coordenador/listarPee' ||
                                                        currentRoute === '/coordenador/perfil' ||
                                                        currentRoute === '/coordenador/listarMeusPees')) {
                return true;
              } else if (userAccessLevel === 'cra' && (currentRoute === '/cra' ||
                                                       currentRoute === '/cra/processo-red' ||
                                                       currentRoute === '/cra/listar' ||
                                                       currentRoute === '/cra/cadastrar'||
                                                       currentRoute === '/cra/listarRed' ||
                                                       currentRoute === '/cra/perfil')) {
                return true;
              } else if (userAccessLevel === 'csp' && (currentRoute === '/csp' ||
                                                       currentRoute === '/csp/listar' ||
                                                       currentRoute === '/csp/cadastrar' ||
                                                       currentRoute === '/csp/docentes' ||
                                                       currentRoute === '/csp/cadastrarDocentes' ||
                                                       currentRoute === '/csp/listarRed' ||
                                                       currentRoute === '/csp/perfil')) {
                return true;
              } else if (userAccessLevel === 'docente' && (currentRoute === '/docente' ||
                                                           currentRoute === '/docente/outra-rota-convidado')) {
                return true;
              } else if (userAccessLevel === 'administrador' && (currentRoute === '/administrador' ||
                                                                currentRoute === '/administrador/listarReds'||
                                                                currentRoute === '/administrador/listarDisciplinas' ||
                                                                currentRoute === '/administrador/cadastrarDisciplina'||
                                                                currentRoute === '/administrador/listarDocentes'||
                                                                currentRoute === '/administrador/cadastrarDocente'||
                                                                currentRoute === '/administrador/listarAlunos'||
                                                                currentRoute === '/administrador/cadastrarAluno'||
                                                                currentRoute === '/administrador/listarCursos'||
                                                                currentRoute === '/administrador/cadastrarCurso')) {
                return true;
              } else if (userAccessLevel === 'professor' && (currentRoute === '/professor' ||
                                                             currentRoute === '/professor/listarPees'||
                                                             currentRoute === '/professor/listarPeesAbonados' ||
                                                             currentRoute === '/professor/perfil')) {
                return true;
              }

            }
          }
          this.router.navigate(['login']);
          return false;
        }
  }
