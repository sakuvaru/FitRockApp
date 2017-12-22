import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ selector: '[title]' })
export class TitleDirective implements OnInit, AfterViewInit {

    constructor(
        private el: ElementRef,
    ) {
    }

    ngOnInit() {
        this.makeTitle();
    }


    ngAfterViewInit() {
        this.makeTitle();
    }

    makeTitle(): void {
        // console.log(this.el);
    }
}

