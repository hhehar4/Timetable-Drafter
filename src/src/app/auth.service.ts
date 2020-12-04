import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authToken: any;
  public user: any;

  constructor(private http: HttpClient) { }

  //Sends backend request to register user
  regUser(user) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/users/register', user, httpOptions);
  }

  //Sends backend request to authenticate user login
  authenticateUser(user) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post('/users/authenticate', user, httpOptions);
  }

  //Checks if the user has admin status
  checkAdmin() {
    try {
      return this.user.admin;
    } catch {
      return false;
    }
  }

  //Stores user JWT and data in local storage
  storeUser(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  //Sends backend request for keyword search
  public keywordSearch(keyword: String): Observable<any>  {
    return this.http.get(`/general/keyword/${keyword}`);
  }

  //Sends backend request to get all users, only works for admin due to token
  public getUsers(): Observable<any>  {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    };
    return this.http.get(`/admin/getUsers/${this.authToken}`, httpOptions);
  }

  //Sends backend request to get all reviews, only works for admin due to token
  public getAllReviews(): Observable<any>  {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    };
    return this.http.get(`/admin/getReviews/${this.authToken}`, httpOptions);
  }

  //Sends backend request for subject and course search
  public baseSearch(flag: String, input1: String, input2: String): Observable<any>  {
    if(input1) {
        if(input2) {
          return this.http.get(`/general/times/${flag}/${input1}/${input2}`);
        } else {
          return this.http.get(`/general/times/${flag}/${input1}`);
        }
    } else {
      return this.http.get(`/general/times/${flag}`);
    }
  }

  //Sends backend request to verify if a course exists
  public verifyCourse(input1: String, input2: String): Observable<any>  {
    return this.http.get(`/general/verify/${input1}/${input2}`); 
  }

  //Sends backend request to get all lists which are public
  public getPublicLists(): Observable<any> {
    return this.http.get(`/general/publicLists`);
  }

  //Sends backend request to get all personal lists, only works for logged in users due to token
  public getPersonalLists(): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    };
    return this.http.get(`/secure/myLists/${this.authToken}`, httpOptions);
  }

  //Sends backend request to update timetable, only works for logged in users due to token
  public updateTimetable(data, courses: any[], originalName: String): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    data.courses = courses;
    return this.http.put(`/secure/updateTimetables/${originalName}/${this.authToken}`, data, httpOptions);
  }

  //Sends backend request to create new timetable, only works for logged in users due to token
  public createTimetable(data, courses: any[]): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    data.courses = courses;
    return this.http.post(`/secure/createTimetables/${this.authToken}`, data, httpOptions);
  }

  //Sends backend request to delete timetable, only works for logged in users due to token
  public deleteTimetable(name: String): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    return this.http.delete(`/secure/deleteTable/${name}/${this.authToken}`, httpOptions);
  }

  //Sends backend request to get all reviews for a given course
  public getReviews(subject: String, course: String): Observable<any> {
    return this.http.get(`/general/reviews/${subject}/${course}`);
  }

  //Sends backend request to create a review for a given course, only works for logged in users due to token
  public createReview(data): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    return this.http.post(`/secure/addReview/${this.authToken}`, data, httpOptions);
  }

  //Sends backend a request to activate/deactivate user accounts, only works for admins due to token
  public toggleUserStatus(user): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    return this.http.put(`/admin/toggleUserStatus/${this.authToken}`, user, httpOptions);
  }

  //Sends backend a request to show/hide reviews, only works for admins due to token
  public toggleReviewStatus(review): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    return this.http.put(`/admin/toggleReviewStatus/${this.authToken}`, review, httpOptions);
  }

  //Sends backend a request to assign admin to user accounts, only works for admins due to token
  public assignAdmin(user): Observable<any> {
    const httpOptions = {
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
    }; 
    return this.http.put(`/admin/assignAdmin/${this.authToken}`, user, httpOptions);
  }

  //Logout(), loadToken(), and loggedIn() implemented to manage login status following this tutorial: https://www.youtube.com/watch?v=rt6VSxXL4_w
  //Clears local storage and saved user data
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  //Gets the token from the local storage
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  //Checks if the user token is still valid
  loggedIn() {
    return helper.isTokenExpired(this.authToken);
  }
}
