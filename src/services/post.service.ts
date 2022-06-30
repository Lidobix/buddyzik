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

  getAllPosts(): Observable<Post[]> {
    console.log('recherche des posts sur le serveur....');
    return this.http.get<Post[]>(this.serverService.serverUrl + '/fetchposts');
  }
}
