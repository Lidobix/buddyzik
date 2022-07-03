import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, lastValueFrom } from 'rxjs';
import { Buddy } from 'src/app/models/buddy-model';
moment().format();

// import { BuddyService } from './buddy.service';

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

  // newUser!: Buddy;
  ngOnInit(): void {
    console.log('redémarrage AuthService');
  }
  logout(): void {
    this.displayingElementsService.setDisplayNav(false);
    // this.displayingElementsService.setDisplayModif(false);
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  getMyToken(): any {
    // console.log('fetch du token');
    this.myToken = localStorage.getItem('token');
    if (this.myToken != null && this.myToken != undefined) {
      return this.myToken;
    } else {
      alert("Problème d'identification, vous allez être déconnecté");
      this.logout();
    }
  }
  getMyId(): any {
    // console.log('fetch du uuid');
    this.myID = localStorage.getItem('uuid');
    // console.log(this.myID);
    if (this.myID != null && this.myID != undefined) {
      // console.log(this.myID);
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
      console.log(form);
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

              // this.buddyService.userIdBuilder(authentication.user);
              this.profileService.goToProfile(authentication.user.uuid);
              // this.router.navigateByUrl('/home');
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
        console.log('soumission du formulaire...');
        this.http

          .post<any>(this.serverService.serverUrl + route, form.value)
          .subscribe((res) => {
            console.log(res);
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
