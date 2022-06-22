import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from 'src/services/auth.service';

import { DisplayingElementsService } from 'src/services/displaying-elements.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,

    private displayingElementsService: DisplayingElementsService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.authService.getAuth();
    console.log('dans le canactivate, token:', this.authService.isLogged);

    if (this.authService.isLogged) {
      this.displayingElementsService.setDisplayNav(true);
      this.displayingElementsService.setDisplayCreation(false);
      return true;
    } else {
      console.log('go to /auth/login');
      this.displayingElementsService.setDisplayNav(false);
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}
