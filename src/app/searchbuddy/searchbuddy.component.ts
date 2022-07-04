import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { BuddyService } from 'src/services/buddy.service';
import { Buddy } from '../models/buddy-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-searchbuddy',
  templateUrl: './searchbuddy.component.html',
  styleUrls: ['./searchbuddy.component.scss'],
})
export class SearchbuddyComponent implements OnInit {
  allBuddies!: Buddy[];
  user!: Buddy;
  connectedUser!: Observable<Buddy>;

  constructor(
    private buddyService: BuddyService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getAllBuddies();
  }
  onInvitation(invitation: boolean) {
    setTimeout(() => {
      this.getAllBuddies();
    }, 500);
  }
  onDeletion(deletion: boolean) {
    if (deletion) {
      setTimeout(() => {
        this.getAllBuddies();
      }, 500);
    }
  }

  getAllBuddies(): void {
    this.connectedUser = this.buddyService.getBuddyByID(
      this.authService.getMyId()
    );
    this.connectedUser.subscribe((result) => {
      this.user = result;
    });

    this.buddyService.getAllBuddies().subscribe((buddies) => {
      this.allBuddies = buddies;
    });
  }
}
