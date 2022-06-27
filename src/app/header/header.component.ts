import { Component, OnInit } from '@angular/core';
import { BuddyService } from '../../services/buddy.service';
import { AuthService } from 'src/services/auth.service';
import { Buddy } from '../models/buddy-model';
import { ProfileService } from 'src/services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  logoutButton!: boolean;
  constructor(
    private buddyService: BuddyService,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  // logoutRequest(): void {
  //   this.authService.logout();
  // }
  // public logoutCommand(status: boolean): void {
  //   this.logoutButton = this.buddyService.connectedUser.online;
  // }

  goToMyProfile(): void {
    // this.displayingElementsService.setDisplayModif(true);
    this.profileService.goToProfile(this.authService.getMyId());
    // this.router.navigateByUrl('/blankprofile');
  }

  ngOnInit(): void {
    // console.log(this.buddyService.connectedUser);
    // if (this.buddyService.connectedUser) {
    //   this.logoutButton = true;
    // } else {
    //   this.logoutButton = false;
    // }
    // this.logoutButton = this.buddyService.connectedUser.connected;
    // console.log('this.userConnected = ', this.logoutButton);
  }
}
