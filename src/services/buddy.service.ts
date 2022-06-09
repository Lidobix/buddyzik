import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Buddy } from 'src/app/models/buddy-model';

import { ServerService } from './server.service';
@Injectable({
  providedIn: 'root',
})
export class BuddyService implements OnInit {
  connectedUser!: Buddy;
  // serverURL!: string;

  constructor(private http: HttpClient, private serverService: ServerService) {}
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
    // console.log('recherche de tes buddies.....');
    return this.http.get<Buddy[]>(this.serverService.serverUrl + '/mybuddies');
  }

  getAllBuddies(): Observable<Buddy[]> {
    // console.log('recherche de tous les buddies.....');
    // console.log('server....', this.serverService.serverUrl);
    return this.http.get<Buddy[]>(this.serverService.serverUrl + '/allbuddies');
  }

  // inviteBuddy(uuidToInvite: string): Observable<string> {
  //   console.log(`envoi de l'invitation de ${uuidToInvite} au serveur...`);
  //   return this.http.post<string>(
  //     this.serverService.serverUrl + '/invitation',
  //     { buddyTarget: uuidToInvite }
  //   );
  // }

  // confirmBuddy(uuidToConfirm: string): Observable<string> {
  //   console.log(`envoi de l'acceptation de ${uuidToConfirm} au serveur...`);
  //   return this.http.post<string>(
  //     this.serverService.serverUrl + '/confirmation',
  //     { buddyTarget: uuidToConfirm }
  //   );
  // }

  updateBuddy(uuidToUpdate: string, action: string): Observable<string> {
    // console.log(`envoi de l'acceptation de ${uuidToUpdate} au serveur...`);
    return this.http.post<string>(this.serverService.serverUrl + action, {
      buddyTarget: uuidToUpdate,
    });
  }

  // setConnection(connectedStatus: boolean): any {
  //   console.log('setConnection : ', connectedStatus);
  //   return this.http.post<any>(
  //     this.serverService.serverUrl + '/setconnection',
  //     { connected: connectedStatus }
  //   );
  // }
}
