import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

import { Buddy } from 'src/app/models/buddy-model';
import { AuthService } from './auth.service';

import { ServerService } from './server.service';
@Injectable({
  providedIn: 'root',
})
export class BuddyService implements OnInit {
  connectedUser!: Buddy;

  // serverURL!: string;

  constructor(
    private http: HttpClient,
    // private authService: AuthService,
    private serverService: ServerService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    //   this.serverURL = this.serverService.serverUrl;
    console.log("dans l'init");
  }
  userIdBuilder(userData: Buddy): void {
    this.connectedUser = userData;
    console.log("dans l'account", this.connectedUser);
    alert('le buddy account a bien été créé');
  }

  getMyBuddies(): Observable<Buddy[]> {
    // getMyBuddies(): Buddy[] {
    console.log('recherche de tes buddies vers le serveur.....');
    return this.http.get<Buddy[]>(
      this.serverService.serverUrl + '/fetchmybuddies'
    );
  }

  getAllBuddies(): Observable<Buddy[]> {
    console.log('recherche de tous les buddies.....');

    return this.http.get<Buddy[]>(this.serverService.serverUrl + '/allbuddies');
  }
  getBuddyByID(id: string): Observable<Buddy> {
    return this.http.post<Buddy>(this.serverService.serverUrl + '/buddybyid', {
      buddyTarget: id,
    });
  }

  // getMe(): Observable<Buddy> {
  //   console.log('dans authservice, on va fetcher moi)');
  //   return this.http.post<Buddy>(this.serverService.serverUrl + '/me', '');
  // }
  getMyInformations(): Observable<Buddy> {
    console.log('dans authservice, on va fetcher moi)');

    return this.http.get<Buddy>(
      this.serverService.serverUrl + '/myinformations'
    );

    // return this.http.post<Buddy>(this.serverService.serverUrl + '/me', '');
  }

  updateBuddy(uuidToUpdate: string, action: string): Observable<string> {
    // console.log(`envoi de l'acceptation de ${uuidToUpdate} au serveur...`);
    return this.http.post<string>(this.serverService.serverUrl + action, {
      buddyTarget: uuidToUpdate,
    });
  }
}
