import { Injectable, OnInit } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor, OnInit {
  uuid!: string;
  token!: string;
  constructor() {}

  ngOnInit(): void {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');

    const uuid: string | null = localStorage.getItem('uuid');

    if (token && uuid) {
      const cloned = req.clone({
        headers: req.headers.set('token', token).set('uuid', uuid),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
