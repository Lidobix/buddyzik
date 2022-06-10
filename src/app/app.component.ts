import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { BuddyService } from 'src/services/buddy.service';
import { ServerService } from 'src/services/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'buddyzik';
  showNav!: boolean;

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
    // alert('ouverture!');
    // this.getAuth();
  }

  ngOnDestroy(): void {
    this.setDisconnection();
    this.mongoOFF();
  }
  mongoOFF(): void {
    this.http.get(this.serverService.serverUrl + '/mongoff').subscribe();
  }

  setDisconnection(): void {
    this.http
      .post<any>(this.serverService.serverUrl + '/setconnection', {
        connected: false,
      })
      .subscribe();

    // this.buddyService.setConnection(false).subscribe();
  }
  // getAuth(): void {
  //   console.log("check du token à l'ouverture : ");
  //   this.authService.getAuth().subscribe((authorization) => {
  //     console.log('authorization : ', authorization);
  //     if (!authorization) {
  //       console.log('pas de token valide');
  //       this.router.navigateByUrl('/login');
  //     } else {
  //       console.log('token valide, on poursuit la nav');
  //     }
  //   });
  // }
}
