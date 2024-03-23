import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-coordenador',
  templateUrl: './coordenador.component.html',
  styleUrls: ['./coordenador.component.css']
})
export class CoordenadorComponent {
  constructor(
    public authenticationService: authenticationService,
    private router: Router
  ) { }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
