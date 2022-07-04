import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/services/auth.service';
import { ProfileService } from 'src/services/profile.service';

@Component({
  selector: 'app-empty-to-my-profile',
  templateUrl: './empty-to-my-profile.component.html',
  styleUrls: ['./empty-to-my-profile.component.scss'],
})
export class EmptyToMyProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.goToProfile(this.authService.getMyId());
  }
}
