import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}
  userLoginForm!: FormGroup;
  userEmail!: string;
  userPassword!: string;

  // cryptoKey!: string;
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
    // this.authService.getPrivateCryptoKey().subscribe((key) => {
    //   console.log(key);
    //   this.cryptoKey = key;
    // });

    // console.log('p = ', crypto.SHA256('p').toString());

    this.authService.authUser(this.userLoginForm, '/login');
    console.log('form envoyé au serveur');
    this.router.navigateByUrl('/home');
    console.log('redirection vers home');
  }
}
