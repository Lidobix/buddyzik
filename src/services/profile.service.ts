import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private router: Router) {}

  goToProfile(id: string): void {
    console.log('en route vers le profil de ', id);
    this.router.navigateByUrl(`profile/${id}`);
  }
}
