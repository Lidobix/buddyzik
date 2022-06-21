import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisplayNavService {
  displayingNav = new BehaviorSubject(false);
  setDisplayNav(display: boolean) {
    this.displayingNav.next(display);
  }
  constructor() {}
}
