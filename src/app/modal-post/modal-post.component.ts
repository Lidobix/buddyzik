import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/image.service';
import { PostService } from 'src/services/post.service';
import { ProfileService } from 'src/services/profile.service';
import { pictureValidator } from 'src/shared/picture-format.directive';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.scss'],
})
export class ModalPostComponent implements OnInit {
  @Input() postRecipient!: string;
  @Output() cancelPost = new EventEmitter<boolean>();
  @Output() updatePosts = new EventEmitter<boolean>();
  postForm!: FormGroup;
  previewPostPic!: string;
  srcResult!: string;
  selectedFile: any = null;
  showFile: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private imageService: ImageService,
    private postService: PostService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // this.postService.defineTarget();
    this.postForm = this.formBuilder.group({
      post: [null, Validators.required],
      postPic: [null, pictureValidator(this.authService.pictureExtension)],
      recipient: [this.postRecipient],
    });
  }

  selectFile(event: any): void {
    const file = event.target.files[0];

    this.imageService.getBase64(file).subscribe((str) => {
      this.previewPostPic = str;
    });
  }
  onSubmitPostForm(): void {
    this.postForm.value.postPic = this.previewPostPic;
    const retour = this.postService.uploadPost(
      this.postForm,
      '/uploadpost',
      this.postRecipient
    );
    console.log('retour = ', retour);
    this.onCancelPost();
    this.onUpdatePosts();

    // this.postService.getAllPosts('869cd705-5d80-47e5-954d-84f2515fd7ad');
  }
  onUpdatePosts(): void {
    this.updatePosts.emit(true);
    console.log('update = ', this.updatePosts);
  }
  onCancelPost(): void {
    this.cancelPost.emit(false);
    // this.updatePosts.emit(true);
    console.log('cancelPost = ', this.cancelPost);
  }
}