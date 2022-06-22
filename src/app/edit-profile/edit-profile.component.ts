import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/services/auth.service';

import { BuddyService } from '../../services/buddy.service';
import { ageValidator } from 'src/shared/minimum-age.directive';
import { pictureValidator } from 'src/shared/picture-format.directive';
import { ImageService } from 'src/services/image.service';
import { DisplayingElementsService } from 'src/services/displaying-elements.service';
import { Buddy } from '../models/buddy-model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  userProfileForm!: FormGroup;
  previewProfilePic!: string;
  displayCreationMode!: boolean;
  constrolsFormList: string[] = [
    'login',
    'password',
    'mailAddress',
    'firstName',
    'lastName',
    'birthDate',
    'location',
    'gender',
    'instrument',
    'singer',
    'pro',
    'bio',
    'profilePicture',
    'bannerPicture',
  ];

  instrumentsList: string[] = [
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

  newuser!: object;
  myDatas!: Buddy;

  // genericPattern: string = '^[^<].*[^>]$';
  // passwordPattern: string =
  //   '^[^<>](?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*[^<>]$';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private buddyService: BuddyService,
    private imageservice: ImageService,
    private displayingElementsService: DisplayingElementsService
  ) {}

  ngOnInit(): void {
    this.displayingElementsService.displayingProfileCreationMode.subscribe(
      (updateClassCrea) => {
        this.displayCreationMode = updateClassCrea;
      }
    );

    console.log('displayCreationMode : ', this.displayCreationMode);

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
      bannerPicture: [null],
    });

    if (!this.displayCreationMode) {
      // this.buddyService.getBuddyByID()

      this.userProfileForm.controls['singer'].setValue('yes');
      this.userProfileForm.controls['instrument'].setValue('Synthé');
    } else {
    }
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
