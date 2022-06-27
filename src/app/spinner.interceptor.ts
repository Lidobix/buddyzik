import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SpinnerService } from 'src/services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor, OnInit {
  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    console.log("dans l'einterceptor spinner");
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerService.displaySpinner();

    return next
      .handle(request)
      .pipe(catchError(this.handleError.bind(this)))
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hideSpinner();
          }
          return event;
        })
      );
  }

  private handleError(error: Response | any) {
    this.spinnerService.hideSpinner();
    return throwError(error);
  }
}
