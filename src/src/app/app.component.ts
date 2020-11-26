import { Component, OnInit } from '@angular/core';
import { ValidateService } from './validate.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'src';

  constructor(private validateService: ValidateService, private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    alert("You have logged out");
    this.router.navigate(['login']);
    return false;
  }
}
