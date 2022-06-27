import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, lastValueFrom } from 'rxjs';
moment().format();

// import { BuddyService } from './buddy.service';

import { DisplayingElementsService } from './displaying-elements.service';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  myID!: string | null;
  myToken!: string | null;

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
    // private buddyService: BuddyService,
    private serverService: ServerService,
    private router: Router,
    private displayingElementsService: DisplayingElementsService
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

  // public isLoggedIn() {
  //   return moment().isBefore(this.getExpiration());
  // }

  // isLoggedOut() {
  //   return !this.isLoggedIn();
  // }
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

              // this.buddyService.userIdBuilder(authentication.user);

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

  updatehUser(form: FormGroup, route: string): void {
    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        this.http

          .post<any>(this.serverService.serverUrl + route, form.value)
          .subscribe((res) => {
            console.log(res);
            alert(res);
            // if (authentication.success === true) {
            //   alert(authentication.message);
            //   localStorage.setItem('token', authentication.token);
            //   localStorage.setItem('uuid', authentication.user.uuid);
            //   // this.buddyService.userIdBuilder(authentication.user);
            if (res.token != undefined) {
              localStorage.setItem('token', res.token);
            }

            //   this.router.navigateByUrl('/home');
            // } else {
            //   alert(authentication.message);
            // }
          });

        if (route === '/updateprofile') {
          this.router.navigateByUrl('/blankprofile');
        }
        if (route === '/resetpassword') {
          this.router.navigateByUrl('/auth/login');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // setResetPassword(form: FormGroup): void {
  //   console.log('dans le service, demande de reste pwd');
  //   this.http
  //     .post<any>(this.serverService.serverUrl + '/resetpassword', form)
  //     .subscribe();
  // }
}
