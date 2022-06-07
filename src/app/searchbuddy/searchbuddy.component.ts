import { Component, OnInit } from '@angular/core';
import { BuddyService } from 'src/services/buddy.service';
import { Buddy } from '../models/buddy-model';

@Component({
  selector: 'app-searchbuddy',
  templateUrl: './searchbuddy.component.html',
  styleUrls: ['./searchbuddy.component.scss'],
})
export class SearchbuddyComponent implements OnInit {
  // addButton: boolean = true;
  // recommendButton: boolean = false;
  // deleteButton: boolean = false;
  allBuddies!: Buddy[];

  constructor(private buddyService: BuddyService) {}
  ngOnInit(): void {
    this.getAllBuddies();
  }
  getAllBuddies(): void {
    this.buddyService.getAllBuddies().subscribe((buddies) => {
      this.allBuddies = buddies;
      console.log("dans l'observable de tous les buddies ", this.allBuddies);
    });
  }
}
