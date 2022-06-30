import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private router: Router) {}

  goToProfile(id: string): void {
    this.router.navigateByUrl(`profile/${id}`);
  }
}
