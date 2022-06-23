import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisplayingElementsService {
  displayingNav = new BehaviorSubject(false);
  setDisplayNav(display: boolean) {
    this.displayingNav.next(display);
  }
  // displayingModifProfileButton = new BehaviorSubject(false);
  // setDisplayModif(display: boolean) {
  //   this.displayingModifProfileButton.next(display);
  // }
  displayingProfileCreationMode = new BehaviorSubject(true);
  setDisplayCreation(display: boolean) {
    this.displayingProfileCreationMode.next(display);
  }
  recommendedClassCard = new BehaviorSubject(false);
  setRecommendedClassCard(display: boolean) {
    this.recommendedClassCard.next(display);
  }
  constructor() {}
}
