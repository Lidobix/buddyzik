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
  displayspinner!: boolean;

  displayModalPost: boolean = false;
  displayValidationModalPost: boolean = false;

  constructor(
    private buddyService: BuddyService,
    private postService: PostService,
    private serverService: ServerService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private displayingElementsService: DisplayingElementsService
  ) {}

  ngOnInit(): void {
    this.displayspinner = true;

    this.buddyUuid = this.route.snapshot.params['uuid'];
    this.count();
    //   console.log('dans le nouvel observable, '), posts;
    // });
    // console.log('buddyID : ', this.buddyUuid);
    // console.log('buddy à charger: ', this.buddyUuid);
    this.buddyService.getBuddyByID(this.buddyUuid).subscribe((value) => {
      this.buddy = value;
      // console.log('utilisateur connecté : ', this.buddy);
    });
    // this.displayingElementsService.displayingValidationModalPost.subscribe(
    //   (showValidationModalPost) => {
    //     this.displayValidationModalPost = showValidationModalPost;
    //   }
    // );
    this.getPosts();
    // this.displayspinner = false;
  }

  count(): any {
    let i = 0;
    this.decompte = setInterval((score: any) => {
      this.getPosts();
    }, 2000);
  }

  getPosts() {
    // const buddyID = this.route.snapshot.params['uuid'];
    // console.log('on va fetcher les posts');
    // console.log('this.buddy', this.buddyUuid);
    // this.allPosts$ = this.postService.getAllPosts(this.buddyUuid).subscribe();
    this.postService.getAllPosts(this.buddyUuid).subscribe((posts: Post[]) => {
      this.allPosts = posts;
      // console.log("dans l'observable de tous les posts ", this.allPosts);
    });
  }

  // onUpdatePosts(request: any) {
  //   console.log('dans  onUpdatePosts');
  //   if (request) {
  //     this.getPosts();
  //   }
  // }
  onPostRequest(): void {
    this.displayModalPost = true;
    // console.log(this.buddy.firstName);
  }
  onCancellingPost(display: boolean): void {
    // console.log('dans  onCancellingPost');
    this.displayModalPost = false;
    // this.postService
    //   .getAllPosts('869cd705-5d80-47e5-954d-84f2515fd7ad')
    this.getPosts();
    // setTimeout(() => {this.getPosts()}, 1000);
  }
  onCloseValidationModalPost(display: boolean) {
    // this.displayValidationModalPost = false;
  }

  ngOnDestroy(): any {
    console.log('destroy');

    clearInterval(this.decompte);
  }
}
