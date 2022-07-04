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

  constructor(
    private http: HttpClient,

    private serverService: ServerService
  ) {}
  ngOnInit(): void {
    console.log("dans l'init");
  }
  userIdBuilder(userData: Buddy): void {
    this.connectedUser = userData;
    console.log("dans l'account", this.connectedUser);
    alert('le buddy account a bien été créé');
  }

  getMyBuddies(): Observable<Buddy[]> {
    return this.http.get<Buddy[]>(
      this.serverService.serverUrl + '/fetchmybuddies'
    );
  }

  getAllBuddies(): Observable<Buddy[]> {
    return this.http.get<Buddy[]>(this.serverService.serverUrl + '/allbuddies');
  }
  getBuddyByID(id: string): Observable<Buddy> {
    return this.http.post<Buddy>(this.serverService.serverUrl + '/buddybyid', {
      buddyTarget: id,
    });
  }

  getMyInformations(): Observable<Buddy> {
    return this.http.get<Buddy>(
      this.serverService.serverUrl + '/myinformations'
    );
  }

  updateBuddy(uuidToUpdate: string, action: string): Observable<string> {
    return this.http.post<string>(this.serverService.serverUrl + action, {
      buddyTarget: uuidToUpdate,
    });
  }
}
