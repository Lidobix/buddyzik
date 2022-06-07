import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';
import { BuddyService } from 'src/services/buddy.service';
import { Buddy } from '../models/buddy-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mybuddies',
  templateUrl: './mybuddies.component.html',
  styleUrls: ['./mybuddies.component.scss'],
})
export class MybuddiesComponent implements OnInit {
  myBuddies!: Buddy[];
  updateMyBuddies!: any;

  constructor(private buddyService: BuddyService) {}
  ngOnInit(): void {
    this.getMyBuddies();
    this.updateMyBuddies = setInterval(() => {
      this.getMyBuddies();
    }, 1000);
  }

  getMyBuddies(): any {
    this.buddyService.getMyBuddies().subscribe((buddies) => {
      // console.log("dans l'observable, buddies =  ", buddies);
      this.myBuddies = buddies;
      // console.log("dans l'observable ", this.myBuddies);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.updateMyBuddies);
  }
}
