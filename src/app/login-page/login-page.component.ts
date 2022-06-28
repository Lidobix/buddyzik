import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { DisplayingElementsService } from 'src/services/displaying-elements.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private displayingElementsService: DisplayingElementsService
  ) {}
  userLoginForm!: FormGroup;
  // userEmail!: string;
  // userPassword!: string;

  ngOnInit(): void {
    this.userLoginForm = this.formBuilder.group({
      mailAddress: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      password: [
        null,
        {
          validators: [Validators.required],
        },
      ],
    });
  }
  goToInscription(): void {
    this.displayingElementsService.setDisplayCreation(true);
    this.router.navigateByUrl('/registration');
  }

  onSubmitLoginForm() {
    console.log(this.userLoginForm);
    this.authService.authUser(this.userLoginForm, '/login');
    console.log('form envoyé au serveur');
    this.router.navigateByUrl('/home');
    console.log('redirection vers home');
  }
}
