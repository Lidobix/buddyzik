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
      profilePicture: ['', pictureValidator(this.authService.pictureExtension)],
      bannerPicture: [
        '',

        // pictureValidator(this.authService.pictureExtension)
      ],
    });
    // this.onchanges();
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
