import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
})
export class LoginCardComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}
  userLoginForm!: FormGroup;
  userEmail!: string;
  userPassword!: string;
  // login$!: Observable<boolean | Object>;

  ngOnInit(): void {
    this.userLoginForm = this.formBuilder.group({
      mailAddress: [null],
      password: [null],
    });
  }
  goToInscription(): void {
    this.router.navigateByUrl('/registration');
  }

  onSubmitLoginForm() {
    console.log(typeof this.userLoginForm);
    this.authService.authUser(this.userLoginForm, '/login');
  }
}
