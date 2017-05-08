import { Component, Input } from '@angular/core';

@Component({
  templateUrl: 'error.component.html'
})
export class ErrorComponent {
  private errorMessage: string;

  constructor() {
    this.errorMessage = "ASEF";
  }
}