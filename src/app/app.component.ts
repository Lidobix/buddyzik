import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { BuddyService } from 'src/services/buddy.service';
import { ServerService } from 'src/services/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'buddyzik';
  showNav!: boolean;
  isLogged!: boolean;
  constructor(
    private router: Router,
    private authService: AuthService,
    private buddyService: BuddyService,
    private http: HttpClient,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
    // console.log(
    //   "localStorage.getItem('token') : ",
    //   localStorage.getItem('token')
    // );
    if (localStorage.getItem('token') != null) {
      this.showNav = true;
    } else {
      this.showNav = false;
    }
    this.getAuth();
    // alert('ouverture!');
    // this.getAuth();
  }

  getAuth(): void {
    console.log("check du token à l'ouverture de l'app");
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
  }
}
