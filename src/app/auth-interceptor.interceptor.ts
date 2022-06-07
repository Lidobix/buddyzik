import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');
    const uuid: string | null = localStorage.getItem('uuid');
    // console.log("dans l'interceptor", token);

    if (token && uuid) {
      console.log('uuid = ', uuid);
      console.log('token = ', token);
      // console.log("j'ajoute le token aux headers");
      const cloned = req.clone({
        headers: req.headers.set('token', token).set('uuid', uuid),
      });

      return next.handle(cloned);
    } else {
      // console.log('pas de token....');
      return next.handle(req);
    }
  }

  constructor() {}
}
