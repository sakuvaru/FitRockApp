import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'unauthorized',
  templateUrl: 'unauthorized.component.html'
})
export class UnauthorizedComponent {

constructor(private router: Router){}
}