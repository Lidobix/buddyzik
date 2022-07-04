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

  goToMyProfile(): void {
    this.profileService.goToProfile(this.authService.getMyId());
  }

  ngOnInit(): void {}
}
