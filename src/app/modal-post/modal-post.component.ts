import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/image.service';
import { pictureValidator } from 'src/shared/picture-format.directive';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.scss'],
})
export class ModalPostComponent implements OnInit {
  @Input() postRecipient!: string;
  @Output() cancelPost = new EventEmitter<boolean>();
  postForm!: FormGroup;
  previewPostPic!: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
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
    this.authService.updatehUser(this.postForm, '/sendpost');
  }

  onCancelPost(): void {
    this.cancelPost.emit(false);
  }
}
