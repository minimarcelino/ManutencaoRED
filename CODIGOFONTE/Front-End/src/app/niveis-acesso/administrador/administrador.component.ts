import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) { }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
