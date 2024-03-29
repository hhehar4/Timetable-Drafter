import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor (private authService: AuthService, private router: Router) {}

    //Ensures user can only access links specific to their authorization
    canActivate() {
        if(!(this.authService.loggedIn()) && (this.authService.checkAdmin())) {
            return true;
        }
        else {
            this.router.navigate(['login']);
            return false;
        }
    }
}