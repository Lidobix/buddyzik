import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BuddyService } from '../../services/buddy.service';
import { Buddy } from '../models/buddy-model';
import { AuthService } from 'src/services/auth.service';

import { HttpClient } from '@angular/common/http';
import { ServerService } from 'src/services/server.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../models/post-model';
import { PostService } from 'src/services/post.service';
import { ProfileService } from 'src/services/profile.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  buddy!: Buddy;
  allPosts!: Post[];
  profilePicUrl!: string;
  pseudo!: string;
  buddyUuid!: string;
  user!: Buddy;
  myID!: string;
  displayModalPost: boolean = false;

  // url: string = 'http://localhost:3100';
  constructor(
    private buddyService: BuddyService,
    private postService: PostService,
    private serverService: ServerService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.buddyUuid = this.route.snapshot.params['uuid'];

    // console.log('buddyID : ', this.buddyUuid);
    // console.log('buddy à charger: ', this.buddyUuid);
    this.buddyService.getBuddyByID(this.buddyUuid).subscribe((value) => {
      this.buddy = value;
      // console.log('utilisateur connecté : ', this.buddy);
    });

    this.getPosts();
  }

  getPosts() {
    // const buddyID = this.route.snapshot.params['uuid'];
    console.log('this.buddy', this.buddyUuid);
    this.postService.getAllPosts(this.buddyUuid).subscribe((posts) => {
      this.allPosts = posts;
      console.log("dans l'observable de tous les posts ", this.allPosts);
    });
  }

  onPostRequest(): void {
    this.displayModalPost = true;
    console.log(this.buddy.firstName);
  }
  onCancellingPost(display: boolean): void {
    this.displayModalPost = false;
  }
}
