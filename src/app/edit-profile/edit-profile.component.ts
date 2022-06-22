import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/services/auth.service';

import { BuddyService } from '../../services/buddy.service';
import { ageValidator } from 'src/shared/minimum-age.directive';
import { pictureValidator } from 'src/shared/picture-format.directive';
import { ImageService } from 'src/services/image.service';
// import { EDEADLK } from 'constants';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userProfileForm!: FormGroup;
  instrumentsList!: string[];
  previewProfilePic!: string;

  // profilePicture: string = null;
  // messageError: string = ;
  newuser!: object;

  // genericPattern: string = '^[^<].*[^>]$';
  // passwordPattern: string =
  //   '^[^<>](?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*[^<>]$';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private buddyService: BuddyService,
    private imageservice: ImageService
  ) {}

  ngOnInit(): void {
    this.userProfileForm = this.formBuilder.group({
      login: [
        null,
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
        '@gmail.com',
        { validators: [Validators.required, Validators.email] },
      ],
      firstName: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      lastName: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      birthDate: [
        '',
        {
          validators: [
            Validators.required,
            ageValidator(this.authService.minimumAge),
          ],
        },
      ],
      location: [
        null,
        {
          validators: [Validators.required],
        },
      ],
      gender: [null, Validators.required],

      instrument: [null, Validators.required],
      singer: [null, Validators.required],
      pro: [null, Validators.required],
      bio: [null],
      profilePicture: [
        null,
        pictureValidator(this.authService.pictureExtension),
      ],
      bannerPicture: [
        '',

        // pictureValidator(this.authService.pictureExtension)
      ],
    });

    this.instrumentsList = [
      'Aucun',
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
  selectFile(event: any) {
    const file = event.target.files[0];

    this.imageservice.getBase64(file).subscribe((str) => {
      this.previewProfilePic = str;
    });
  }

  onSubmitProfileForm() {
    this.userProfileForm.value.profilePicture = this.previewProfilePic;
    console.log('soumission du formulaire: ', this.userProfileForm);

    this.authService.authUser(this.userProfileForm, '/register');
  }
}
