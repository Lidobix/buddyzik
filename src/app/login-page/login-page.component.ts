import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { DisplayingElementsService } from 'src/services/displaying-elements.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  mailAddress = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  userLoginForm = new FormGroup({
    mailAddress: this.mailAddress,
    password: this.password,
  });
  constructor(
    private router: Router,
    private authService: AuthService,
    private displayingElementsService: DisplayingElementsService
  ) {}

  ngOnInit(): void {}

  getErrorMessage() {
    if (this.mailAddress.hasError('required')) {
      return 'You must enter a value';
    }

    return this.mailAddress.hasError('email') ? 'Not a valid email' : '';
  }

  goToInscription(): void {
    this.displayingElementsService.setDisplayCreation(true);
    this.router.navigateByUrl('/registration');
  }

  submit() {
    console.log(this.userLoginForm);
    this.authService.authUser(this.userLoginForm, '/login');
    console.log('form envoyé au serveur');
    this.router.navigateByUrl('/home');
    console.log('redirection vers home');
  }
}
