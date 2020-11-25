import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  checkAllInputsReg(user) {
    return (user.name == undefined || user.email == undefined || user.password == undefined || user.vPassword == undefined || (user.password != user.vPassword));
  }

  checkAllInputsLog(user) {
    return (user.email == undefined || user.password == undefined);
  }

  validateEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  }
}
