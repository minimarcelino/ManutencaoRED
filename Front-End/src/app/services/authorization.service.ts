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
    constructor(
        private router: Router,
        private storage: storageService,
        private authentication: authenticationService
      ) {}

      async canActivate(next: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Promise<boolean> {
          const token = await this.authentication.getToken();
          if(token){
            return true;
          }else{
            this.router.navigate(['login']);
            return false
          }
        }
  }