import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
moment().format();

import { BuddyService } from './buddy.service';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  minimumAge: number = 18;
  pictureExtension: string[] = ['jpg', 'jpeg', 'png', 'bmp', 'svg', 'gif'];
  passwordPattern: string =
    '^[^<>](?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*[^<>]$';

  authentication!: boolean;
  constructor(
    private http: HttpClient,
    private buddyService: BuddyService,
    private serverService: ServerService,
    private router: Router
  ) {}

  // newUser!: Buddy;
  ngOnInit(): void {
    console.log('redémarrage AuthService');
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('friends');
    localStorage.removeItem('uuid');

    // this.buddyService.connectedUser.connected = false;
    // this.http
    //   .post<any>(
    //     this.serverService.serverUrl + '/logout',
    //     this.buddyService.connectedUser.uuid
    //   )
    //   .subscribe((retour) => {});

    this.router.navigateByUrl('/login');
    // this.buddyService.userIdBuilder(new Buddy());
  }

  // private setSession(authResult) {
  //   const expiresAt = moment().add(authResult.expiresIn, 'second');

  //   localStorage.setItem('id_token', authResult.token);
  //   localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  // }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
  getAuth() {
    console.log("Authentification à l'ouverture de l'appli...");
    return this.http.post<object>(
      this.serverService.serverUrl + '/auth',
      'sdvqrfqr'
      // );
      // return this.http.get<any>(this.serverService.serverUrl + '/auth', {
      //   responseType: 'json',
      // });
    );
  }
  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    console.log('expiration', expiration);
    console.log('moment : ', moment());
    // const expiresAt = JSON.parse(expiration);
    // return moment(expiresAt);
    return 12;
  }
  // fetchAutoStartAuth() {
  //   console.log('dans la foncton fetchAutoStartAuth');
  //   return this.http
  //     .get<boolean>(this.serverService.serverUrl + '/auth')
  //     .subscribe((retour) => {
  //       console.log("retour du serveur du check token à l'ouverture: ", retour);

  //       return retour;
  //     });
  // }

  authUser(
    form: FormGroup,
    route: string
    // messageValidation: string,
    // messageError: string
  ): void {
    // console.log('dans le service + submitForm');
    // console.log('route : ', route);

    // console.log(form);

    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        // console.log('dans le try, le form; ', form.value);

        this.http

          .post<any>(this.serverService.serverUrl + route, form.value)
          .subscribe((authentication) => {
            // console.log('Le serveur a dit ', authentication);
            // console.log('friends_list ', authentication.user.friends_list);

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
