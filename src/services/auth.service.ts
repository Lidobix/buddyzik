import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { Buddy } from 'src/app/models/buddy-model';
moment().format();

import { DisplayingElementsService } from './displaying-elements.service';
import { ProfileService } from './profile.service';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  myID!: string | null;
  myToken!: string | null;
  connectedUser!: Buddy;
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
    'JPG',
    'JPEG',
    'PNG',
    'BMP',
    'SVG',
    'GIF',
    'WEBP',
  ];
  passwordPattern: string =
    '^[^<>](?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*[^<>]$';

  authentication!: boolean;
  constructor(
    private http: HttpClient,
    private serverService: ServerService,
    private router: Router,
    private displayingElementsService: DisplayingElementsService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {}
  logout(): void {
    this.displayingElementsService.setDisplayNav(false);

    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  getMyToken(): any {
    this.myToken = localStorage.getItem('token');
    if (this.myToken != null && this.myToken != undefined) {
      return this.myToken;
    } else {
      alert("Problème d'identification, vous allez être déconnecté");
      this.logout();
    }
  }
  getMyId(): any {
    this.myID = localStorage.getItem('uuid');

    if (this.myID != null && this.myID != undefined) {
      return this.myID;
    } else {
      alert("Problème d'identification, vous allez être déconnecté");
      this.logout();
    }
  }

  async getAuth() {
    this.isLogged = await lastValueFrom(
      this.http.get<boolean>(this.serverService.serverUrl + '/auth')
    );
  }

  authUser(form: FormGroup, route: string): void {
    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        this.http

          .post<any>(this.serverService.serverUrl + route, form.value)
          .subscribe((authentication) => {
            if (authentication.success === true) {
              localStorage.setItem('token', authentication.token);
              localStorage.setItem('uuid', authentication.user.uuid);
              this.profileService.goToProfile(authentication.user.uuid);
            } else {
              alert(authentication.message);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  updatehUser(form: FormGroup, route: string): void {
    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        this.http

          .post<any>(this.serverService.serverUrl + route, form.value)
          .subscribe((res) => {
            alert(res.message);
            if (res.token != undefined) {
              localStorage.setItem('token', res.token);
            }

            if (route === '/updateprofile' && res.success === true) {
              this.profileService.goToProfile(this.getMyId());
            }
            if (route === '/updateprofile' && res.success === false) {
              this.router.navigateByUrl('/edition');
            }

            if (route === '/resetpassword') {
              this.router.navigateByUrl('/auth/login');
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
