import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss'],
})
export class ResetPwdComponent implements OnInit {
  // resetPasswordForm!: FormGroup;
  mailAddress = new FormControl('', [Validators.required, Validators.email]);

  resetPasswordForm = new FormGroup({
    mailAddress: this.mailAddress,
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.resetPasswordForm = this.formBuilder.group({
    //   mailAddress: [
    //     '',
    //     { validators: [Validators.required, Validators.email] },
    //   ],
    // });
  }
  getErrorMessage() {
    if (this.mailAddress.hasError('required')) {
      return 'You must enter a value';
    }

    return this.mailAddress.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmitResetForm(): void {
    console.log('confirmation de la demande de reset', this.resetPasswordForm);
    // this.authService.updatehUser(this.resetPasswordForm, '/resetpassword');
    this.authService.updatehUser(this.resetPasswordForm, '/resetpassword');
  }
}
