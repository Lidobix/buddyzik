import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { DisplayNavService } from 'src/services/display-nav.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private displayNavService: DisplayNavService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.authService.getAuth();
    console.log('dans le canactivate, token:', this.authService.isLogged);

    if (this.authService.isLogged) {
      this.displayNavService.setDisplayNav(true);
      return true;
    } else {
      console.log('go to /auth/login');
      this.displayNavService.setDisplayNav(false);
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}
