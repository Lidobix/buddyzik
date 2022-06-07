import { Component, Input, OnInit } from '@angular/core';
import { BuddyCard } from '../models/buddycard-model';
import { Buddy } from '../models/buddy-model';
import { BuddyService } from 'src/services/buddy.service';

@Component({
  selector: 'app-buddycard',
  templateUrl: './buddycard.component.html',
  styleUrls: ['./buddycard.component.scss'],
})
export class BuddycardComponent implements OnInit {
  // @Input() buddyCard!: BuddyCard;
  @Input() buddy!: Buddy;

  constructor(private buddyService: BuddyService) {}

  inviteBuddy() {
    console.log('this.buddy = ', this.buddy);
    // this.buddyService.inviteBuddy(this.buddy.uuid).subscribe();
    this.buddyService.updateBuddy(this.buddy.uuid, '/invitation').subscribe();
    // this.buddy.addable = false;
    this.buddy.status = 'invited';
  }
  goToBuddyProfile() {}
  deleteBuddy() {
    this.buddyService.updateBuddy(this.buddy.uuid, '/deletion').subscribe();
    this.buddy.status = 'unknown';
  }

  confirmBuddy() {
    console.log('this.buddy = ', this.buddy);
    // this.buddyService.confirmBuddy(this.buddy.uuid).subscribe();
    this.buddyService.updateBuddy(this.buddy.uuid, '/confirmation').subscribe();
    this.buddy.status = 'confirmed';
  }
  recommendBuddy() {
    console.log('this.buddy = ', this.buddy);
    // this.buddyService.confirmBuddy(this.buddy.uuid).subscribe();
    this.buddyService
      .updateBuddy(this.buddy.uuid, '/recommendation')
      .subscribe();
    // this.buddy.status = 'recommended';
  }
  ngOnInit(): void {}
}
