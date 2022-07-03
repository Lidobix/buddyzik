import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
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
  // userProfileForm!: FormGroup;
  previewProfilePic: string =
    'https://vetref.fr/equipe/lequipe-vetref/nos-veterinaires/service-de-medecine-interne/dr-margot-caria/blank-profile-picture-973460_640/';
  displayCreationMode!: boolean;

  hide = true;
  login = new FormControl(
    '',

    [Validators.required, Validators.minLength(3)]
  );
  password = new FormControl('', [
    Validators.required,
    // Validators.pattern(this.authService.passwordPattern),
  ]);

  passwordModif = new FormControl(
    ''
    // {
    //   validators: [Validators.pattern(this.authService.passwordPattern)],
    // },
  );
  mailAddress = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl(null, [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  birthDate = new FormControl('', [
    Validators.required,
    ageValidator(this.authService.minimumAge),
  ]);
  location = new FormControl(null, [Validators.required]);
  gender = new FormControl([null, Validators.required]);
  style = new FormControl([null, Validators.required]);

  instrument = new FormControl([null, Validators.required]);
  singer = new FormControl([null, Validators.required]);
  pro = new FormControl([null, Validators.required]);
  bio = new FormControl([null]);
  group = new FormControl([null]);
  profilePicture = new FormControl([
    null,
    Validators.required,
    pictureValidator(this.authService.pictureExtension),
  ]);

  userProfileForm = new FormGroup({
    login: this.login,
    password: this.password,
    passwordModif: this.passwordModif,
    mailAddress: this.mailAddress,
    firstName: this.firstName,
    lastName: this.lastName,
    birthDate: this.birthDate,
    location: this.location,
    gender: this.gender,
    instrument: this.instrument,
    singer: this.singer,
    pro: this.pro,
    bio: this.bio,
    profilePicture: this.profilePicture,
    style: this.style,
    group: this.group,
  });

  // controlsFormList: string[] = [
  //   'login',
  //   'password',
  //   'mailAddress',
  //   'firstName',
  //   'lastName',
  //   'birthDate',
  //   'location',
  //   'gender',
  //   'instrument',
  //   'singer',
  //   'pro',
  //   'bio',
  //   'profilePicture',
  //   'bannerPicture',
  // ];

  stylesList: string[] = [
    'Rock',
    'Classique',
    'Variétés',
    'Rap/RnB',
    'Musique du monde',
    'Electro',
    'Electro Swing',
    'Années 80',
    'Disco / Funk',
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
    // console.log('displayCreationMode : ', this.displayCreationMode);
    // this.userProfileForm = this.formBuilder.group({
    //   login: [
    //     null,
    //     {
    //       validators: [
    //         // Validators.required, Validators.minLength(3)
    //       ],
    //     },
    //   ],
    //   password: [
    //     '',
    //     {
    //       validators: [
    //         Validators.required,
    //         // Validators.pattern(this.authService.passwordPattern),
    //       ],
    //     },
    //   ],
    //   passwordModif: [
    //     '',
    //     // {
    //     //   validators: [Validators.pattern(this.authService.passwordPattern)],
    //     // },
    //   ],
    //   mailAddress: [
    //     '',
    //     {
    //       validators: [
    //         // Validators.required, Validators.email
    //       ],
    //     },
    //   ],
    //   firstName: [
    //     null,
    //     {
    //       validators: [
    //         // Validators.required
    //       ],
    //     },
    //   ],
    //   lastName: [
    //     null,
    //     {
    //       validators: [
    //         // Validators.required
    //       ],
    //     },
    //   ],
    //   birthDate: [
    //     '',
    //     {
    //       validators: [
    //         // Validators.required,
    //         // ageValidator(this.authService.minimumAge),
    //       ],
    //     },
    //   ],
    //   location: [
    //     null,
    //     {
    //       validators: [
    //         // Validators.required
    //       ],
    //     },
    //   ],
    //   gender: [
    //     null,
    //     // Validators.required
    //   ],
    //   instrument: [
    //     null,
    //     //  Validators.required
    //   ],
    //   singer: [
    //     null,
    //     // Validators.required
    //   ],
    //   pro: [
    //     null,
    //     //  Validators.required
    //   ],
    //   bio: [null],
    //   profilePicture: [
    //     null,
    //     pictureValidator(this.authService.pictureExtension),
    //   ],
    //   bannerPicture: [null],
    // });
    console.log('this.displayCreationMode : ', this.displayCreationMode);
    if (!this.displayCreationMode) {
      console.log('on remplit le formulaire');
      this.formFilling();
    }
  }

  getErrorMessage() {
    if (this.mailAddress.hasError('required')) {
      return 'You must enter a value';
    }

    return this.mailAddress.hasError('email') ? 'Not a valid email' : '';
  }
  formFilling(): void {
    this.buddyService
      // .getBuddyByID(this.authService.getMyId())
      .getMyInformations()
      .subscribe((value) => {
        console.log('je suis : ', value);

        this.userProfileForm.controls['login'].setValue(value['login']);

        this.userProfileForm.controls['mailAddress'].setValue(
          value['mailAddress']
        );
        this.userProfileForm.controls['firstName'].setValue(value['firstName']);
        this.userProfileForm.controls['lastName'].setValue(value['lastName']);
        this.userProfileForm.controls['birthDate'].setValue(value['birthDate']);
        this.userProfileForm.controls['location'].setValue(value['location']);
        this.userProfileForm.controls['gender'].setValue(value['gender']);
        this.userProfileForm.controls['instrument'].setValue(
          value['instrument']
        );
        this.userProfileForm.controls['singer'].setValue(value['singer']);
        this.userProfileForm.controls['style'].setValue(value['style']);
        this.userProfileForm.controls['pro'].setValue(value['pro']);
        this.userProfileForm.controls['bio'].setValue(value['bio']);
        this.userProfileForm.controls['group'].setValue(value['group']);
      });
  }

  selectFile(event: any): void {
    const file = event.target.files[0];

    this.imageservice.getBase64(file).subscribe((str) => {
      this.previewProfilePic = str;
    });
  }

  onSubmitProfileForm(): void {
    this.userProfileForm.value.profilePicture = this.previewProfilePic;
    console.log('soumission du formulaire: ', this.userProfileForm);

    this.authService.authUser(this.userProfileForm, '/register');
  }

  onSubmitModifProfileForm(): void {
    if (this.userProfileForm.value.password === '') {
      delete this.userProfileForm.value.password;
    }

    console.log('modification du formulaire: ', this.userProfileForm);

    this.authService.updatehUser(this.userProfileForm, '/updateprofile');
  }
}
