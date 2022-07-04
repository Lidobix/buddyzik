import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'buddyzik';
  spinnerVisible!: boolean;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.spinnerObs$.subscribe((visible) => {
      setTimeout(() => {
        this.spinnerVisible = visible;
      });
    });
  }

  ngOnInit() {}
}
