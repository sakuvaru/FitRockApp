import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BaseComponent } from '../base.component';
import { ComponentDependencyService } from '../component-dependency.service';

@Component({
})
export abstract class BaseModuleComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // -------------- Observable subscriptions -------------- //

  protected subscribeToObservables(observables: Observable<any>[], options?: {
    enableLoader?: boolean,
    setComponentAsInitialized?: boolean
  }): void {

    let enableLoader;
    let setComponentAsInitialized;

    if (!options) {
      enableLoader = true;
      setComponentAsInitialized = true;
    } else {
      enableLoader = options.enableLoader;
      setComponentAsInitialized = options.setComponentAsInitialized;
    }

    if (enableLoader) {
      this.startGlobalLoader();
    }

    this.dependencies.helpers.observableHelper.zipObservables(observables)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((val) => {
        this.stopAllLoaders();
      },
      error => {
        this.stopAllLoaders();
        this.handleSubscribeError(error);
      }
      );
  }

  protected subscribeToObservable(observable: Observable<any>, options?: {
    enableLoader?: boolean,
    setComponentAsInitialized?: boolean
  }): void {

    let enableLoader;
    let setComponentAsInitialized;

    if (!options) {
      enableLoader = true;
      setComponentAsInitialized = true;
    } else {
      enableLoader = options.enableLoader;
      setComponentAsInitialized = options.setComponentAsInitialized;
    }

    if (enableLoader) {
      this.startGlobalLoader();
    }

    observable
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.stopAllLoaders();
      },
      error => {
        this.stopAllLoaders();
        super.handleSubscribeError(error);
      }
      );
  }

}
