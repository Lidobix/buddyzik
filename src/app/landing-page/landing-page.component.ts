import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  isLogged!: boolean;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getAuth();
  }

  getAuth(): void {
    if (localStorage.getItem('uuid') != null) {
      this.authService.getAuth().subscribe((authorization) => {
        // console.log('type : ', typeof authorization);
        // // console.log('type : ');
        console.log('authorization cuicui : ', authorization);
        // this.isLogged = authorization.isLogged;
        if (!authorization) {
          console.log('pas de token valide');
          // this.router.navigateByUrl('/login');
          this.isLogged = false;
        } else {
          console.log('token valide, on poursuit la nav');
          this.isLogged = true;
          this.router.navigateByUrl('/home');
        }
      });
    } else {
      this.isLogged = false;
    }
    console.log("check du token à l'ouverture : ");
  }
}
