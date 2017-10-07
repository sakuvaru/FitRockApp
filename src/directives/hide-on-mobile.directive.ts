import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs/Rx';

@Directive({ selector: '[hideOnMobile]' })
export class HideOnMobileDirective implements OnInit, OnDestroy, AfterViewInit {

    /**
     * For query options, see
     * https://teradata.github.io/covalent/#/components/media
     */
    private readonly query: string = '(max-width: 959px)';

    /**
     * Indicates if resizing is enabled
     */
    @Input() enabled = true;

    // screen size
    private isSmallScreen = false;
    private _querySubscription: Subscription;

    constructor(
        private el: ElementRef,
        private mediaService: TdMediaService,
        private _ngZone: NgZone
    ) {
    }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        this.watchScreen();
    }

    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        this._querySubscription.unsubscribe();
    }

    ngAfterViewInit() {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.checkScreen();
    }

    checkScreen(): void {
        if (!this.enabled) {
            return;
        }

        this._ngZone.run(() => {
            this.applyStyles(this.mediaService.query(this.query));
        });
    }

    private watchScreen(): void {
        this._querySubscription = this.mediaService.registerQuery(this.query).subscribe((matches: boolean) => {
            this._ngZone.run(() => {
                this.applyStyles(matches);
            });
        });
    }

    private applyStyles(isSmallScreen: boolean): void {
        if (!this.enabled) {
            return;
        }

        if (isSmallScreen) {
            this.el.nativeElement.style.display = 'none';
        }
        else {
            this.el.nativeElement.style.display = 'inline';
        }
    }
}
