import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/services/auth.service';
import { BuddyService } from 'src/services/buddy.service';
import { ServerService } from 'src/services/server.service';
import { Buddy } from '../models/buddy-model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  profilePicture!: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private buddyService: BuddyService,
    private serverService: ServerService,
    private http: HttpClient
  ) {}

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

  ngOnInit(): void {
    this.authService.getAuth();
    //??????????????????????????????????????????
  }
}
