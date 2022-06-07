import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/services/auth.service';

import { BuddyService } from '../../services/buddy.service';
import { ageValidator } from 'src/shared/minimum-age.directive';
import { pictureValidator } from 'src/shared/picture-format.directive';
// import { EDEADLK } from 'constants';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userProfileForm!: FormGroup;
  instrumentsList!: string[];
  // messageError: string = ;
  newuser!: object;

  // genericPattern: string = '^[^<].*[^>]$';
  // passwordPattern: string =
  //   '^[^<>](?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*[^<>]$';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private buddyService: BuddyService
  ) {}

  ngOnInit(): void {
    this.userProfileForm = this.formBuilder.group({
      login: [
        'ludo',
        {
          validators: [Validators.required, Validators.minLength(3)],
        },
      ],
      password: [
        'Blup1-1pulB',
        {
          validators: [
            Validators.required,
            Validators.pattern(this.authService.passwordPattern),
          ],
        },
      ],
      mailAddress: [
        'zhzl@EDEADLK.com',
        { validators: [Validators.required, Validators.email] },
      ],
      firstName: [
        'sgsgergegr',
        {
          validators: [Validators.required],
        },
      ],
      lastName: [
        'sdgdgtgeteteh',
        {
          validators: [Validators.required],
        },
      ],
      birthDate: [
        '25/10/1985',
        {
          validators: [
            // Validators.required,
            // ageValidator(this.authService.minimumAge),
          ],
        },
      ],
      location: [
        'skhflzflfhlf',
        {
          validators: [Validators.required],
        },
      ],
      gender: [
        null,
        // Validators.required
      ],

      instrument: [null],
      singer: [null],
      pro: [null],
      bio: [null],
      profilePicture: [
        'avatar.jpeg',
        // pictureValidator(this.authService.pictureExtension),
      ],
      bannerPicture: [
        'avatar.jpeg',
        // pictureValidator(this.authService.pictureExtension),
      ],
    });

    this.instrumentsList = [
      'Guitare',
      'Basse',
      'Ukulélé',
      'Batterie',
      'Cajun',
      'Trompette',
      'Synthé',
      'piano',
      'Flûte traversière',
    ];
  }

  onSubmitProfileForm() {
    console.log(typeof this.userProfileForm);
    this.authService.authUser(
      this.userProfileForm,
      '/register'
      // this.messageValidation,
      // this.messageError
    );

    // console.log(this.userProfileForm.controls);
    // console.log(this.userProfileForm.status);

    // if (!this.userProfileForm.valid) {
    //   alert('Formulaire non valide!');
    // } else {
    //   try {
    //     this.authService
    //       .submitEditProfileForm(this.userProfileForm.value)
    //       .subscribe((authentication) => {
    //         console.log('Le serveur a dit ', authentication);
    //         if (authentication) {
    //           alert('Vous êtes bien inscrit, bonne navigation!');
    //           this.newuser = authentication;
    //           this.buddyService.userIdBuilder(authentication);
    //           this.router.navigateByUrl('/profile/:id');
    //         } else {
    //           alert('Pas possible de vous inscrire!');
    //         }
    //       });
    //   } catch (error) {}
    // }
  }
}
