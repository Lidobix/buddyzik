import { Injectable, OnInit } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor, OnInit {
  uuid!: string;
  token!: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');

    const uuid: string | null = localStorage.getItem('uuid');
    console.log("dans l'interceptor, uuid:", uuid);
    console.log("dans l'interceptor, token:", token);
    // this.uuid = this.authService.getMyId();
    // console.log(this.uuid);
    // this.token = this.authService.getMyToken();
    if (token && uuid) {
      const cloned = req.clone({
        headers: req.headers.set('token', token).set('uuid', uuid),
      });

      return next.handle(cloned);
    } else {
      // console.log('pas de token....');
      return next.handle(req);
    }
  }
}
