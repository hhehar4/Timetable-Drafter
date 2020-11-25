import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../validate.service';

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

  constructor(private validateService: ValidateService) { }

  ngOnInit(): void {
  }

  registerSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      vPassword: this.vPassword
    }

    //Check if all fields are there
    if(this.validateService.checkAllInputsReg(user)) {
      alert("Please enter all fields");
    }

    //Check if email is in proper format
    else if(!this.validateService.validateEmail(this.email)) {
      alert("Please enter a valid email");
    }
  }
}
