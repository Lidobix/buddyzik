import { Injectable } from '@angular/core';
import { Post } from 'src/app/models/post-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServerService } from './server.service';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private serverService: ServerService) {}

  getAllPosts(buddyUuid: string): Observable<Post[]> {
    console.log('recherche des posts sur le serveur....de ', buddyUuid);
    return this.http.post<Post[]>(
      this.serverService.serverUrl + '/downloadposts',
      { target: buddyUuid }
    );
  }
}
