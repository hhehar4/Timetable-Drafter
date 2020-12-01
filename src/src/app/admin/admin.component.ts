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
