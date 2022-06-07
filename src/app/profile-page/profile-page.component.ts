import { Component, OnInit } from '@angular/core';
import { BuddyService } from '../../services/buddy.service';
import { Buddy } from '../models/buddy-model';
import { AuthService } from 'src/services/auth.service';

import { HttpClient } from '@angular/common/http';
import { ServerService } from 'src/services/server.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  bannierPicUrl!: string;
  profilePicUrl!: string;
  pseudo!: string;
  user!: Buddy;
  // url: string = 'http://localhost:3100';
  constructor(
    private buddyService: BuddyService,
    private serverService: ServerService,
    private authService: AuthService,
    private http: HttpClient
  ) {}
  logoutRequest(): void {
    this.authService.logout();
  }

  fetch(): void {
    this.http
      .get<any>(this.serverService.serverUrl + '/fetch')
      .subscribe((retour) => {
        console.log(retour);
      });
  }
  ngOnInit(): void {
    this.bannierPicUrl = './assets/concert.jpeg';
    this.profilePicUrl = './assets/profil.jpg';
    this.pseudo = 'Jean-Mi la Gratte de la mort qui tue';
    console.log('utilisateur connecté : ', this.buddyService.connectedUser);
    this.user = this.buddyService.connectedUser;
  }
}
