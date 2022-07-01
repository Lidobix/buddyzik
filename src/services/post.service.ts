import { Injectable } from '@angular/core';
import { Post } from 'src/app/models/post-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServerService } from './server.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ProfileService } from './profile.service';
import { ActivatedRoute } from '@angular/router';
import { DisplayingElementsService } from './displaying-elements.service';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  allPosts!: Post[]; // postTarget!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private displayingElementsService: DisplayingElementsService
  ) {}

  getAllPosts(buddyTarget: string): any {
    // console.log('recherche des posts sur le serveur....de ', buddyTarget);
    return this.http.post<Post[]>(
      this.serverService.serverUrl + '/downloadposts',
      {
        target: buddyTarget,
      }
    );
  }
  // getAllPosts(buddyTarget: string): Observable<Post[]> {
  //   console.log('recherche des posts sur le serveur....de ', buddyTarget);
  //   return this.http.post<Post[]>(
  //     this.serverService.serverUrl + '/downloadposts',
  //     { target: buddyTarget }
  //   );
  // }

  uploadPost(form: FormGroup, route: string, buddyTarget: string): any {
    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        console.log('soumission du formulaire...');
        return this.http

          .post<Post[]>(this.serverService.serverUrl + route, form.value)
          .subscribe((res) => {
            console.log('res', res);
            // this.displayingElementsService.setdisplayValidationModalPost(true);
            // alert(res.message);
            console.log('route = ', route);
            // this.getAllPosts('869cd705-5d80-47e5-954d-84f2515fd7ad');
            // this.profileService.goToProfile(buddyTarget);
            // this.router.navigateByUrl('/blankprofile');
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
