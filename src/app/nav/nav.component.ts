import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { BuddyService } from 'src/services/buddy.service';

import { DisplayingElementsService } from 'src/services/displaying-elements.service';
import { ProfileService } from 'src/services/profile.service';
import { Buddy } from '../models/buddy-model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private buddyService: BuddyService,

    private displayingElementsService: DisplayingElementsService
  ) {}
  user!: Buddy;
  displayNav!: boolean;
  displayModif!: boolean;

  logout(): void {
    console.log('deconnexion requise');
    this.authService.logout();
  }

  ngOnInit(): void {
    this.displayingElementsService.displayingNav.subscribe((updateClassNav) => {
      this.displayNav = updateClassNav;
    });
    this.displayingElementsService.displayingModifProfileButton.subscribe(
      (updateClassModif) => {
        this.displayModif = updateClassModif;
      }
    );
    this.buddyService.getMe();
  }

  goToMyProfile(): void {
    this.displayingElementsService.setDisplayModif(true);
    this.router.navigateByUrl('/blankprofile');
  }

  goToMyBuddysList(): void {
    this.displayingElementsService.setDisplayModif(false);
    this.router.navigateByUrl('/mybuddies');
  }
  goToAllBuddysList(): void {
    this.displayingElementsService.setDisplayModif(false);
    this.router.navigateByUrl('/searchbuddy');
  }
  goToMessaging(): void {
    this.displayingElementsService.setDisplayModif(false);
    this.router.navigateByUrl('/messaging');
  }
  goToTchat(): void {
    this.displayingElementsService.setDisplayModif(false);
    this.router.navigateByUrl('/tchat');
  }

  goToEditProfile(): void {
    this.displayingElementsService.setDisplayModif(false);
  }

  getMe(): any {
    const myId = localStorage.getItem('id');

    // console.log('dans homepage , on va fetcher moi)');
    // this.buddyService
    //   .getBuddyByID(localStorage.getItem('id'))
    //   .subscribe((me) => {
    //     // console.log("dans l'observable, buddies =  ", buddies);
    //     this.user = me;
    //     console.log("dans l'observable me = ", me);
    //   });
  }
}
