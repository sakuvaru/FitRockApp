// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

@Component({
  templateUrl: 'item-404.component.html'
})
export class Item404Component extends BaseComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }
}