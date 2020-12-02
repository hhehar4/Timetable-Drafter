import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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

  constructor(private validateService: ValidateService, public authService: AuthService, private router: Router) { }

  //Logs out upon refresh
  ngOnInit(): void {
    this.authService.logout();
  }

  //Empties local storage of JWT and user upon logot
  logout() {
    this.authService.logout();
    alert("You have logged out");
    this.router.navigate(['']);
    return false;
  }
}
