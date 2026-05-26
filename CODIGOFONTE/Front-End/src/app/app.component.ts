import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../app/services/authentication.service';
import { authorizationService } from './services/authorization.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  title = 'Front-End';
  isLogged = false;
  opened = false;

  // 🔥 controla se está na home
  isHome = false;

  itensMenu = [
    { routerLink: '/home', texto: 'Home', img: 'assets/home.png' },
    { routerLink: '/curso', texto: 'Cursos', img: 'assets/curso.png' },
    { routerLink: '/aluno', texto: 'Alunos', img: 'assets/aluno.png' },
    { routerLink: '/servidor', texto: 'Servidores' }
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private authorization: authorizationService,
    private router: Router
  ) {

    // ✅ Corrige bug visual do mat-form-field ao trocar de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);

      });

  }

  async ngOnInit() {

    // ✅ verifica login
    this.isLogged = await this.authenticationService.isLogado();

    // ✅ define estado inicial
    this.verificarRota(this.router.url);

    // ✅ escuta mudança de rota
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.verificarRota(event.urlAfterRedirects);
      }

    });

  }

  ngAfterViewInit(): void {

    // ✅ Corrige bug inicial dos labels
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

  }

  verificarRota(url: string) {

    const rotasHome = [
      '/administrador',
      '/cra',
      '/csp',
      '/coordenador',
      '/professor'
    ];

    this.isHome = rotasHome.some(rota => url.startsWith(rota));

  }

  async logout() {

    await this.authenticationService.logout();
    this.router.navigate(['/login']);

  }

}