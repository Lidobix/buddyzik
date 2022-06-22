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
  displayingModifProfileButton = new BehaviorSubject(false);
  setDisplayModif(display: boolean) {
    this.displayingModifProfileButton.next(display);
  }
  displayingProfileCreationMode = new BehaviorSubject(false);
  setDisplayCreation(display: boolean) {
    this.displayingProfileCreationMode.next(display);
  }
  constructor() {}
}
