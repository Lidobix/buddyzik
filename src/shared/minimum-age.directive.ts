import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// Validation de l'âge minimum d'inscription sur le site
export function ageValidator(minimumAge: number): ValidatorFn {
  const today: Date = new Date();

  const minimumDate: Date = new Date(
    today.getFullYear() - minimumAge,
    today.getMonth(),
    today.getDay()
  );

  return (control: AbstractControl): ValidationErrors | null => {
    const arrayBirthDate: number[] = control.value.split('-');

    const birthDate: Date = new Date(
      arrayBirthDate[0],
      arrayBirthDate[1],
      arrayBirthDate[2]
    );

    if (birthDate > minimumDate) {
      return { minimumAge: false };
    }
    return null;
  };
}
