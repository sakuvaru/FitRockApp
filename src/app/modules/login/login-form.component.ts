import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AuthTypeEnum } from '../../auth/auth-type.enum';
import { Router } from '@angular/router';

@Component({
    selector: 'login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent{
    // event outputs
    @Output() onLoginEvent = new EventEmitter<boolean>();
    @Output() onLogoutEvent = new EventEmitter();

    // properties
    private username: string;
    private password: string;

    constructor(private authService: AuthService, private router: Router) { }

    // event methods
    onSubmit() { 
        this.authService.authenticate(this.username, this.password, AuthTypeEnum.auth0_standard)
            .then(isAuthenticated => this.handleAuthentication(isAuthenticated))
    }

    onLogout(){
        this.authService.logout();
        this.onLogoutEvent.emit();
    }

    // helper methods
    private handleAuthentication(isAuthenticated: boolean){
      if (isAuthenticated){
          this.onLoginEvent.emit(true);
      }
      else{
         this.onLoginEvent.emit(false); 
      }
    }
}