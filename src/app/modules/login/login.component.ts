import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AuthTypeEnum } from '../../auth/auth-type.enum';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{
    private username: string;
    private password: string;
    private authResult: string;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
    }

    onSubmit() { 
        this.authService.authenticate(this.username, this.password, AuthTypeEnum.auth0_standard)
            .then(isAuthenticated => this.handleAuthentication(isAuthenticated))
    }

    onLogout(){
        this.authService.logout();
    }

    private handleAuthentication(isAuthenticated: boolean){
        if (isAuthenticated){
            this.router.navigate(['/dash']);
        }
        else{
            console.log("FAIL");
            this.authResult = "Fail";
        }
    }
}