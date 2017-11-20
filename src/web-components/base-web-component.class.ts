import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

export abstract class BaseWebComponent implements OnDestroy {

    /**
    * Important - used to unsubsribe ALL subscriptions when component is destroyed. This ensures that requests are cancelled
    * when navigating away from the component.
    * Solution should be official - taken from https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
    * Usage: use 'takeUntl(this.ngUnsubscribe)' for all subscriptions.
    * Example: this.myThingService.getThings()
    *       .takeUntil(this.ngUnsubscribe)
    *      .subscribe(things => console.log(things));
    */
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    /**
    * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnDestroy' as otherwise
    * this method will not be called
    */
    ngOnDestroy() {
        // ng unsubscribe as per recommendation
        // see comments on top
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
