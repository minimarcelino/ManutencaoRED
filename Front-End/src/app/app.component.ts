import { Component, OnInit, ViewChild } from '@angular/core';
import { authenticationService } from '../app/services/authentication.service';
import { authorizationService } from './services/authorization.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(MatSidenav) 
  sidenav!: MatSidenav;

  constructor(private authenticationService: authenticationService, 
    private authorization :authorizationService) {
  } 
  title = 'Front-End';
  isLogged = false;
  opened = false;

  itensMenu = [
    { routerLink: '/home', texto: 'Home', img: 'assets/home.png' },
    { routerLink: '/curso', texto: 'Cursos', img: 'assets/curso.png' },
    { routerLink: '/aluno', texto: 'Alunos', img: 'assets/aluno.png'},
    {routerLink: '/servidor', texto: 'Servidores'}
  ];

  async ngOnInit() {
    this.isLogged = await this.authenticationService.isLogado();
    
  }

}
