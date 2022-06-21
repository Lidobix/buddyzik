import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  showNav: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private buddyService: BuddyService,
    private http: HttpClient,
    private serverService: ServerService
  ) {}

  ngOnInit() {
    console.log("init de l'app");
  }
}
