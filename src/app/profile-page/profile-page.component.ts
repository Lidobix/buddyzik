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
import { DisplayingElementsService } from 'src/services/displaying-elements.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  buddy!: Buddy;
  allPosts!: Post[];
  profilePicUrl!: string;
  pseudo!: string;
  buddyUuid!: string;

  myID!: string;
  decompte!: any;

  displayModalPost: boolean = false;
  displayValidationModalPost: boolean = false;

  constructor(
    private buddyService: BuddyService,
    private postService: PostService,

    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buddyUuid = this.route.snapshot.params['uuid'];
    this.count();

    this.buddyService.getBuddyByID(this.buddyUuid).subscribe((value) => {
      this.buddy = value;
    });

    this.getPosts();
  }

  count(): any {
    let i = 0;
    this.decompte = setInterval((score: any) => {
      this.getPosts();
    }, 2000);
  }

  getPosts() {
    this.postService.getAllPosts(this.buddyUuid).subscribe((posts: Post[]) => {
      this.allPosts = posts;
    });
  }

  onPostRequest(): void {
    this.displayModalPost = true;
  }
  onCancellingPost(display: boolean): void {
    this.displayModalPost = false;

    this.getPosts();
  }
  onCloseValidationModalPost(display: boolean) {}

  ngOnDestroy(): any {
    clearInterval(this.decompte);
  }
}
