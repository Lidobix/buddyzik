import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss'],
})
export class ResetPwdComponent implements OnInit {
  mailAddress = new FormControl('', [Validators.required, Validators.email]);

  resetPasswordForm = new FormGroup({
    mailAddress: this.mailAddress,
  });
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
  getErrorMessage() {
    if (this.mailAddress.hasError('required')) {
      return 'You must enter a value';
    }

    return this.mailAddress.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmitResetForm(): void {
    this.authService.updatehUser(this.resetPasswordForm, '/resetpassword');
  }
}
