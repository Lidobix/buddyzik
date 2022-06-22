import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, lastValueFrom } from 'rxjs';
moment().format();

import { BuddyService } from './buddy.service';
import { DisplayNavService } from './display-nav.service';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  isLogged!: boolean;
  minimumAge: number = 18;
  pictureExtension: string[] = [
    'jpg',
    'jpeg',
    'png',
    'bmp',
    'svg',
    'gif',
    'webp',
  ];
  passwordPattern: string =
    '^[^<>](?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*[^<>]$';

  authentication!: boolean;
  constructor(
    private http: HttpClient,
    private buddyService: BuddyService,
    private serverService: ServerService,
    private router: Router,
    private displayNavService: DisplayNavService
  ) {}

  // newUser!: Buddy;
  ngOnInit(): void {
    console.log('redémarrage AuthService');
  }
  logout(): void {
    this.displayNavService.setDisplayNav(false);
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  // public isLoggedIn() {
  //   return moment().isBefore(this.getExpiration());
  // }

  // isLoggedOut() {
  //   return !this.isLoggedIn();
  // }

  async getAuth() {
    this.isLogged = await lastValueFrom(
      this.http.get<boolean>(this.serverService.serverUrl + '/auth')
    );
  }
  // getExpiration() {
  //   const expiration = localStorage.getItem('expires_at');
  //   console.log('expiration', expiration);
  //   console.log('moment : ', moment());
  //   // const expiresAt = JSON.parse(expiration);
  //   // return moment(expiresAt);
  //   return 12;
  // }

  authUser(form: FormGroup, route: string): void {
    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        this.http

          .post<any>(this.serverService.serverUrl + route, form.value)
          .subscribe((authentication) => {
            if (authentication.success === true) {
              alert(authentication.message);

              localStorage.setItem('token', authentication.token);
              localStorage.setItem('uuid', authentication.user.uuid);

              this.buddyService.userIdBuilder(authentication.user);

              this.router.navigateByUrl('/home');
            } else {
              alert(authentication.message);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
