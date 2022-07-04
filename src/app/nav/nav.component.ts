import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DisplayingElementsService } from 'src/services/displaying-elements.service';
import { ServerService } from 'src/services/server.service';
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
    private serverService: ServerService,
    private http: HttpClient,
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
  }
  testmail(): void {
    this.http
      .get<any>(this.serverService.serverUrl + '/mailtest')
      .subscribe((retour) => {
        console.log(retour);
      });
  }
  goToMyProfile(): void {
    this.router.navigateByUrl('/blankprofile');
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

  goToEditProfile(): void {
    this.displayingElementsService.setDisplayCreation(false);

    this.router.navigateByUrl('/edition');
  }
}
