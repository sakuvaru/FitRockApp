import { Component } from '@angular/core';
import { TdMediaService } from '@covalent/core';

@Component({
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent {
    constructor(private media: TdMediaService) {
    }

    ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
  }
}