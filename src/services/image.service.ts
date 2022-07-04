import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() {}

  getBase64(file: Blob): Observable<string> {
    return new Observable<string>((sub) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        sub.next(reader.result?.toString());

        sub.complete();
      };
      reader.onerror = (error) => {
        sub.error(error);
      };
    });
  }
}
