// common
import { Component, Input, Output, OnInit } from '@angular/core';

@Component({
    selector: 'loader',
    templateUrl: 'loader.component.html'
})
export class LoaderComponent {
    @Input() enabled: boolean;

    constructor(
    ) {
    }
}