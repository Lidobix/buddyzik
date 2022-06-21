import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  validationToken!: boolean;
  //   obs$!: Observable<boolean>;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.authService.getAuth();
    console.log('dans le canactivate');
    console.log('  this.authService.isLogged', this.authService.isLogged);
    if (this.authService.isLogged) {
      return true;
    } else {
      console.log('go to /auth/login');
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}
