import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post-model';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;
  avatarPicture!: string;
  postPicture!: string;
  constructor() {}

  ngOnInit(): void {
    this.avatarPicture = this.post.avatar;
    this.postPicture = this.post.picPost;
  }
}
