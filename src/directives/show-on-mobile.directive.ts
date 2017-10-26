import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs/Rx';

@Directive({ selector: '[showOnMobile]' })
export class ShowOnMobileDirective implements OnInit, OnDestroy, AfterViewInit {

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
        this.watchScreen();
    }

    ngOnDestroy() {
        this._querySubscription.unsubscribe();
    }

    ngAfterViewInit() {
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

        if (!isSmallScreen) {
            this.el.nativeElement.style.display = 'none';
        } else {
            this.el.nativeElement.style.display = 'inline';
        }
    }
}
