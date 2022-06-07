import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// Validation du format du fichier d'image
export function pictureValidator(
  pictureExtensionsAuthorized: string[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value != null) {
      const arrayPicPath = control.value.split('.');
      const extension = arrayPicPath[arrayPicPath.length - 1];
      if (!pictureExtensionsAuthorized.includes(extension)) {
        return { extensionInvalidity: extension };
      }
    }
    return null;
  };
}
