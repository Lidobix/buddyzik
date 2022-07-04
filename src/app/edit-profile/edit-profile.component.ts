import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  previewProfilePic!: string;

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
  gender = new FormControl(null, [Validators.required]);
  style = new FormControl(null, [Validators.required]);

  instrument = new FormControl(null, [Validators.required]);
  singer = new FormControl(null, [Validators.required]);
  pro = new FormControl(null, [Validators.required]);
  bio = new FormControl(null, [Validators.maxLength(200)]);
  group = new FormControl(null);
  profilePicture = new FormControl(null, [
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

  stylesList: string[] = [
    'Rock',
    'Classique',
    'Variétés',
    'Rap/RnB',
    'Musique du monde',
    'Electro',
    'Electro Swing',
    'DUB',
    'Reggae',
    'Drum&Bass',
    'Indé',
    'Années 80',
    'Disco / Funk',
    'Autre',
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
    'Platines',
  ];

  constructor(
    private authService: AuthService,
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
    this.buddyService.getMyInformations().subscribe((value) => {
      this.userProfileForm.controls['login'].setValue(value['login']);
      this.userProfileForm.controls['mailAddress'].setValue(
        value['mailAddress']
      );
      this.userProfileForm.controls['firstName'].setValue(value['firstName']);
      this.userProfileForm.controls['lastName'].setValue(value['lastName']);
      this.userProfileForm.controls['birthDate'].setValue(value['birthDate']);
      this.userProfileForm.controls['location'].setValue(value['location']);
      this.userProfileForm.controls['gender'].setValue(value['gender']);
      this.userProfileForm.controls['instrument'].setValue(value['instrument']);
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

    this.authService.authUser(this.userProfileForm, '/register');
  }

  onSubmitModifProfileForm(): void {
    if (this.userProfileForm.value.password === '') {
      delete this.userProfileForm.value.password;
    }

    if (this.profilePicture != null) {
      this.userProfileForm.value.profilePicture = this.previewProfilePic;
    }

    this.authService.updatehUser(this.userProfileForm, '/updateprofile');
  }
}
