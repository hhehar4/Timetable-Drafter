import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../validate.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  dataRegister:any={}

  constructor(private validateService: ValidateService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  loginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    }
    
    //Check if all fields are there
    if(this.validateService.checkAllInputsLog(user)) {
      alert("Please enter all fields");
    } 
    //Check if email is in proper format
    else if(!this.validateService.validateEmail(this.email)) {
      alert("Please enter a valid email");
    }
    //Login user
    else {
      this.authService.authenticateUser(user).subscribe(
        response => {
          this.dataRegister = response;
          if(this.dataRegister.success) {
            if(this.dataRegister.user.admin) {
              this.authService.storeUser(this.dataRegister.token, this.dataRegister.user);
              this.router.navigate(['admin']);
            } else {
              this.authService.storeUser(this.dataRegister.token, this.dataRegister.user);
              this.router.navigate(['']);
            }
          } else {
            alert(this.dataRegister.msg)
            this.router.navigate(['login']);
          }
        }
      );
    }
  }
}
