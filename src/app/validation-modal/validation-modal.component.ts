import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DisplayingElementsService } from 'src/services/displaying-elements.service';
@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss'],
})
export class ValidationModalComponent implements OnInit {
  @Output() validation = new EventEmitter<boolean>();

  displayModal!: boolean;
  constructor(private displayingElementsService: DisplayingElementsService) {}
  ngOnInit(): void {}
  onValidation() {}
}
