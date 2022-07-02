import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { BuddyService } from 'src/services/buddy.service';
import { Buddy } from '../models/buddy-model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-mybuddies',
  templateUrl: './mybuddies.component.html',
  styleUrls: ['./mybuddies.component.scss'],
})
export class MybuddiesComponent implements OnInit {
  myBuddies!: Buddy[];
  updateMyBuddies!: any;
  user!: Buddy;
  connectedUser!: Observable<Buddy>;

  constructor(
    private buddyService: BuddyService,
    private authService: AuthService
  ) {
    // this.updateMyBuddies = setInterval(() => {
    //   this.getMyBuddies();
    // }, 3000);
  }

  getMe(): any {}

  getMyBuddies(): any {
    console.log('recherche de mybuddies...');
    console.log('uuid...', localStorage.getItem('uuid'));
    console.log('token...', localStorage.getItem('token'));

    this.buddyService.getMyBuddies().subscribe((buddies) => {
      // console.log("dans l'observable, buddies =  ", buddies);
      this.myBuddies = buddies;
      console.log("dans l'observable ", this.myBuddies);
    });
  }
  ngOnInit() {
    // this.connectedUser = this.buddyService.connectedUser;
    this.connectedUser = this.buddyService.getBuddyByID(
      this.authService.getMyId()
    );
    this.connectedUser.subscribe((result) => {
      this.user = result;
    });

    this.getMyBuddies();
  }
}
