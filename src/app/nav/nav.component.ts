import { Component, OnInit } from '@angular/core';
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
    private buddyService: BuddyService
  ) {}
  user!: Buddy;
  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.user = this.buddyService.connectedUser;
  }
}
