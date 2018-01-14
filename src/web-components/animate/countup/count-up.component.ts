import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';
import * as CountUp from 'countup.js';

@Component({
    selector: 'count-up',
    templateUrl: 'count-up.component.html'
})
export class CountUpComponent extends BaseWebComponent implements AfterViewInit, OnChanges {

    /**
     * Optional extra configuration, such as easing.
     */
    @Input() options: any;

    /**
   * Optional start value for the count. Defaults to zero.
   */
    @Input()
    startVal: number;

    /**
     * The value to count up to.
     */
    private _endVal: number;

    get endVal(): number {
        return this._endVal;
    }
    @Input()
    set endVal(value: number) {

        this._endVal = value;

        if (isNaN(value)) {
            return;
        }

        if (!this.countUp) {
            return;
        }

        this.countUp.update(value);
    }


    /**
   * Optional duration of the animation. Default is two seconds.
   */
    @Input()
    duration: number;

    /**
     * Optional number of decimal places. Default is two.
     */
    @Input()
    decimals: number;

    /**
     * Optional flag for specifying whether the element should re-animate when clicked.
     * Default is true.
     */
    @Input()
    reanimateOnClick: boolean;


    @ViewChild('countElement') countElement;

    private countUp;

    private initialized: boolean = false;

    constructor(
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.init();
    }

    ngAfterViewInit(): void {
        this.init();
    }

    /**
     * Re-animate if preference is set.
     */
    @HostListener('click')
    onClick() {
        if (this.reanimateOnClick) {
            this.animate();
        }
    }

    private init() {
        if (this.initialized) {
            return;
        }

        if (this.endVal && this.endVal > 0) {
            this.countUp = this.createCountUp(this.startVal, this.endVal, this.decimals, this.duration);
            this.animate();
            this.initialized = true;
        }
    }

    private createCountUp(sta, end, dec, dur): any {
        sta = sta || 0;
        if (isNaN(sta)) {
            sta = Number(sta.match(/[\d\-\.]+/g).join('')); // strip non-numerical characters
        }
        end = end || 0;
        if (isNaN(end)) {
            end = Number(end.match(/[\d\-\.]+/g).join('')); // strip non-numerical characters
        }

        dur = Number(dur) || 2;
        dec = Number(dec) || 0;

        // construct countUp
        let countUp = new CountUp(this.countElement.nativeElement, sta, end, dec, dur, this.options);
        if (end > 999) {
            // make easing smoother for large numbers
            countUp = new CountUp(this.countElement.nativeElement, sta, end - 100, dec, dur / 2, this.options);
        }

        return countUp;
    }

    private animate() {
        this.countUp.reset();
        if (this.endVal > 999) {
            this.countUp.start(() => this.countUp.update(this.endVal));
        } else {
            this.countUp.start();
        }
    }
}
