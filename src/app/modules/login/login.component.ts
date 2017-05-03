import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AuthTypeEnum } from '../../auth/auth-type.enum';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.authenticate("yazoo@email.cz", "", AuthTypeEnum.auth0_standard);
    }
}