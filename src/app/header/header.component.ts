import { Component, OnInit } from '@angular/core';
import { BuddyService } from '../../services/buddy.service';
import { AuthService } from 'src/services/auth.service';
import { Buddy } from '../models/buddy-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  logoutButton!: boolean;
  constructor(
    private buddyService: BuddyService,
    private authService: AuthService
  ) {}

  // logoutRequest(): void {
  //   this.authService.logout();
  // }
  public logoutCommand(status: boolean): void {
    this.logoutButton = this.buddyService.connectedUser.online;
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
