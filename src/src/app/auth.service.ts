import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) { }

  regUser(user) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('http://localhost:3000/users/register', user, httpOptions);
  }

  authenticateUser(user) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('http://localhost:3000/users/authenticate', user, httpOptions);
  }

  storeUser(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  public keywordSearch(keyword: String): Observable<any>  {
    return this.http.get(`http://localhost:3000/general/keyword/${keyword}`);
  }

  public baseSearch(flag: String, input1: String, input2: String): Observable<any>  {
    if(input1) {
        if(input2) {
          return this.http.get(`http://localhost:3000/general/times/${flag}/${input1}/${input2}`);
        } else {
          return this.http.get(`http://localhost:3000/general/times/${flag}/${input1}`);
        }
    } else {
      return this.http.get(`http://localhost:3000/general/times/${flag}`);
    }
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return helper.isTokenExpired(this.authToken);
  }
}
