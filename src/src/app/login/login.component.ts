import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;

  constructor(private validateService: ValidateService) { }

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
  }
}
