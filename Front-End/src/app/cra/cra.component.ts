import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router
import { authenticationService } from '../services/authentication.service'; // Importe o authenticationService

@Component({
  selector: 'app-cra',
  templateUrl: './cra.component.html',
  styleUrls: ['./cra.component.css']
})
export class CRAComponent {
  constructor(
    private authenticationService: authenticationService, // Injete o authenticationService
    private router: Router // Injete o Router
  ) { }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']); // redireciona o usuário para a página de login após o logout
  }
}