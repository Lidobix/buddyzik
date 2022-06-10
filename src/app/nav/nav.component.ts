import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { BuddyService } from 'src/services/buddy.service';
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
    private buddyService: BuddyService
  ) {}
  user!: Buddy;
  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.getMe();
  }

  goToProfile(): void {
    this.router.navigateByUrl('/profile/:id');
  }
  goToMyBuddysList(): void {
    this.router.navigateByUrl('/mybuddies');
  }
  goToAllBuddysList(): void {
    this.router.navigateByUrl('/searchbuddy');
  }
  goToMessaging(): void {
    this.router.navigateByUrl('/messaging');
  }
  goToTchat(): void {
    this.router.navigateByUrl('/tchat');
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
