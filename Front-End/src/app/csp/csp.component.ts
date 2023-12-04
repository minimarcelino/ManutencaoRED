import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-csp',
  templateUrl: './csp.component.html',
  styleUrls: ['./csp.component.css']
})
export class CSPComponent {
  constructor(
    public authenticationService: authenticationService,
    private router: Router
  ) { }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}