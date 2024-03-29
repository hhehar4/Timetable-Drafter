import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor (private authService: AuthService, private router: Router) {}

    //Ensures user can only access links specific to their authorization, Implemented following this tutorial: https://www.youtube.com/watch?v=OILrJmjkId4
    canActivate() {
        if(!this.authService.loggedIn()) {
            return true;
        }
        else {
            this.router.navigate(['login']);
            return false;
        }
    }
}