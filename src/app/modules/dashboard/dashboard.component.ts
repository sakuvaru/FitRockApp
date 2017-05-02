import { Component, Input, OnInit } from '@angular/core';

import { Log } from '../../services/log/log.class';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/options.class';
import { LogService } from '../../services/log/log.service';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit{

    private logs: Log[];
    private log: Log;

    constructor(private logService: LogService) { }

    ngOnInit(): void {
        this.logService.getAll( [ new Limit(5), new OrderByDescending("id")]).then(logs => this.logs = logs);
        this.logService.getById(1).then(log => this.log = log);

        //TEST REMOVE
        var tokenName = "token";
        localStorage.setItem(tokenName, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Inlhem9vQGVtYWlsLmN6IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ1c2VyX2lkIjoiYXV0aDB8NThlMGMyMjc3ZTg5YTQwMjcwZmYxYWExIiwiY2xpZW50SUQiOiJ4TDhyVUxoMlNSeU52cmtJb0JweVNhcVV4eU1IRHlJMiIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9mZjdlNTA4MzdiOGYyODZiODAyODU2YzdlZDkxYTkyNz9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnlhLnBuZyIsIm5pY2tuYW1lIjoieWF6b28iLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiNThlMGMyMjc3ZTg5YTQwMjcwZmYxYWExIiwicHJvdmlkZXIiOiJhdXRoMCIsImNvbm5lY3Rpb24iOiJVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbiIsImlzU29jaWFsIjpmYWxzZX1dLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNS0wMlQxNzo0OTozNi44OTdaIiwiY3JlYXRlZF9hdCI6IjIwMTctMDQtMDJUMDk6MTk6MzUuODE4WiIsIm5hbWUiOiJ5YXpvb0BlbWFpbC5jeiIsImlzcyI6Imh0dHBzOi8vZml0cm9jay5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NThlMGMyMjc3ZTg5YTQwMjcwZmYxYWExIiwiYXVkIjoieEw4clVMaDJTUnlOdnJrSW9CcHlTYXFVeHlNSER5STIiLCJleHAiOjE0OTM3ODMzNzYsImlhdCI6MTQ5Mzc0NzM3Nn0.85s6FX-6jzCk-rrPF3y6bNBOuRqWI8k0Kri_MUkflnE");
        var token = localStorage.getItem(tokenName);
        console.log(token);
    }
}