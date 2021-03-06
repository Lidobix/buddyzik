import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Buddy } from '../models/buddy-model';
import { BuddyService } from 'src/services/buddy.service';
import { ProfileService } from 'src/services/profile.service';
import { DisplayingElementsService } from 'src/services/displaying-elements.service';

@Component({
  selector: 'app-buddycard',
  templateUrl: './buddycard.component.html',
  styleUrls: ['./buddycard.component.scss'],
})
export class BuddycardComponent implements OnInit {
  @Input() buddy!: Buddy;
  @Output() rejectionBuddy = new EventEmitter<boolean>();
  @Output() invited = new EventEmitter<boolean>();
  profilePicture!: string;
  isRecommended!: boolean;

  constructor(
    private buddyService: BuddyService,
    private profileService: ProfileService,
    private displayingElementsService: DisplayingElementsService
  ) {}

  inviteBuddy() {
    this.buddyService.updateBuddy(this.buddy.uuid, '/invitation').subscribe();
    this.invited.emit(true);
  }
  inviteBuddyFromReco() {
    this.buddyService
      .updateBuddy(this.buddy.uuid, '/invitationfromreco')
      .subscribe();

    this.buddy.status = 'invited';
  }
  goToBuddyProfile() {
    this.profileService.goToProfile(this.buddy.uuid);
  }
  deleteBuddy() {
    this.buddy.status = 'deletion';
    this.buddyService.updateBuddy(this.buddy.uuid, '/deletion').subscribe();
    this.rejectionBuddy.emit(true);
  }

  confirmBuddy() {
    this.buddyService.updateBuddy(this.buddy.uuid, '/confirmation').subscribe();
    this.buddy.status = 'confirmed';
  }
  recommendBuddy() {
    this.buddyService
      .updateBuddy(this.buddy.uuid, '/recommendation')
      .subscribe();
    this.buddy.status = 'recommendedByMe';
    this.displayingElementsService.setRecommendedClassCard(true);
  }

  ngOnInit(): void {
    this.profilePicture = this.buddy.profilePicture;

    this.displayingElementsService.recommendedClassCard.subscribe(
      (addRecommendationClass) => {
        this.isRecommended = addRecommendationClass;
      }
    );

    if (this.buddy.status === 'recommendedByMe') {
      this.isRecommended = true;
    }
  }
}
