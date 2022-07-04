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
  allPosts!: Post[];

  constructor(
    private http: HttpClient,

    private serverService: ServerService
  ) {}

  getAllPosts(buddyTarget: string): any {
    return this.http.post<Post[]>(
      this.serverService.serverUrl + '/downloadposts',
      {
        target: buddyTarget,
      }
    );
  }

  uploadPost(form: FormGroup, route: string, buddyTarget: string): any {
    if (!form.valid) {
      alert('Formulaire non valide!');
    } else {
      try {
        return this.http

          .post<Post[]>(this.serverService.serverUrl + route, form.value)
          .subscribe((res) => {
            console.log('res', res);

            console.log('route = ', route);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
