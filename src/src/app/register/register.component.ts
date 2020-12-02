import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../validate.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  email: String;
  password: String;
  vPassword: String;
  dataRegister:any={}

  constructor(private validateService: ValidateService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  registerSubmit() {
    const user = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
      vPassword: this.vPassword.trim()
    }

    //Check if all fields are there
    if(this.validateService.checkAllInputsReg(user)) {
      alert("Please enter all fields");
    }

    //Check if email is in proper format
    else if(!this.validateService.validateEmail(this.email)) {
      alert("Please enter a valid email");
    }

    //Ask backend to register user
    this.authService.regUser(user).subscribe(
      response => {
        this.dataRegister = response;
        if(this.dataRegister.success) {
          alert(this.dataRegister.msg);
          this.router.navigate(['/login']);
        } else {
          alert(this.dataRegister.msg);
          this.name = "";
          this.email = "";
          this.password = "";
          this.vPassword = "";
        }
      }
    );
  }
}
