import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BuddyService } from '../../services/buddy.service';
import { Buddy } from '../models/buddy-model';
import { AuthService } from 'src/services/auth.service';

import { HttpClient } from '@angular/common/http';
import { ServerService } from 'src/services/server.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  buddy!: Buddy;

  profilePicUrl!: string;
  pseudo!: string;
  // buddyID!: string;
  user!: Buddy;
  myID!: string;
  displayModalPost: boolean = false;

  // url: string = 'http://localhost:3100';
  constructor(
    private buddyService: BuddyService,
    private serverService: ServerService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}
  // logoutRequest(): void {
  //   this.authService.logout();
  // }

  // fetch(): void {
  //   this.http
  //     .get<any>(this.serverService.serverUrl + '/fetch')
  //     .subscribe((retour) => {
  //       console.log(retour);
  //     });
  // }
  ngOnInit(): void {
    // this.getMe();

    const buddyID = this.route.snapshot.params['uuid'];

    // console.log('this.route : ', this.route.snapshot.params['uuid']);
    // console.log('buddyID : ', buddyID);
    // console.log('buddyID : ', buddyID);
    console.log('buddyID : ', buddyID);
    console.log('buddy à charger: ', buddyID);
    this.buddyService.getBuddyByID(buddyID).subscribe((value) => {
      this.buddy = value;
      console.log('utilisateur connecté : ', this.buddy);
    });
    // this.bannierPicUrl = './assets/concert.jpeg';
    // this.profilePicUrl = './assets/profil.jpg';
    // this.pseudo = 'Jean-Mi la Gratte de la mort qui tue';
    // this.user = this.buddyService.connectedUser;
  }

  onPostRequest(): void {
    this.displayModalPost = true;
    console.log(this.buddy.firstName);
  }
  onCancellingPost(display: boolean): void {
    this.displayModalPost = false;
  }
  // getMe(): any {
  //   console.log('dans homepage , on va fetcher moi)');
  //   const idToFetch = localStorage.getItem('uuid');
  //   if (idToFetch != null) {
  //     this.buddyService.getBuddyByID(idToFetch).subscribe((me) => {
  //       // console.log("dans l'observable, buddies =  ", buddies);
  //       this.user = me;
  //       console.log("dans l'observable me = ", me);
  //     });
  //   } else {
  //     alert("problème d'identification");
  //     this.authService.logout();
  //   }
  // }

  // @HostListener('unload')
  // ngOnDestroy(): void {
  //   console.log('destruction en cours');
  // }
}
