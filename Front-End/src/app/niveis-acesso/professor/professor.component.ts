import { Component } from '@angular/core';
import { authenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent {

  constructor(
    public authenticationService: authenticationService,
    private router: Router
  ) { }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
