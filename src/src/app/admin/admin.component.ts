import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  reviewsList = [];
  usersList = [];
  public reviewsToggle = false;
  public usersToggle = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  //Get all reviews from backend, show review view and hide user view
  toggleReviews() {
    this.authService.getAllReviews()
    .subscribe(
      response => {
        this.reviewsList = response;
      },
      error => {
        alert(error.error);
        this.reviewsList = [];
      }
    );
    this.reviewsToggle = true;
    this.usersToggle = false;
  }

  //Switch the user status between active/deactive
  toggleUserStatus(user) {
    this.authService.toggleUserStatus(user)
    .subscribe(
      response => {
        this.toggleUsers();
      },
      error => {
        alert(error.error);
      }
    );
  }

  //Switch the review status between hidden/visible
  toggleReviewStatus(review) {
    this.authService.toggleReviewStatus(review)
    .subscribe(
      response => {
        this.toggleReviews();
      },
      error => {
        alert(error.error);
      }
    );
  }

  //Assign admin to a user
  assignAdmin(user) {
    this.authService.assignAdmin(user)
    .subscribe(
      response => {
        this.toggleUsers();
      },
      error => {
        alert(error.error);
      }
    );
  }

  //Get all users from backend, show user view and hide review view
  toggleUsers() {
    this.authService.getUsers()
    .subscribe(
      response => {
        this.usersList = response;
      },
      error => {
        alert(error.error);
        this.usersList = [];
      }
    );
    this.reviewsToggle = false;
    this.usersToggle = true;
  }
}
