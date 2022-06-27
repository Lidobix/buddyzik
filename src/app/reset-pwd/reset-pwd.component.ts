import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss'],
})
export class ResetPwdComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      mailAddress: [
        '',
        { validators: [Validators.required, Validators.email] },
      ],
    });
  }

  onSubmitResetForm(): void {
    console.log('confirmation de la demande de reset');
    this.authService.updatehUser(this.resetPasswordForm, '/resetpassword');
  }
}
