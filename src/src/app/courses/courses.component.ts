import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ReviewPopupComponent } from '../review-popup/review-popup.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  subjects: String[];
  keyword: String;
  tempVal: String;
  subIn: String;
  crseIn: String;

  constructor(private authService: AuthService, private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  //Take the keyword entered and request the backend for keyword search
  keySearch() {
    try {
      this.tempVal = this.keyword.toUpperCase();
    }
    catch(e) {}
    this.authService.keywordSearch(this.tempVal)
    .subscribe(
      response => {
        this.subjects = response;
      },
      error => {
        alert(error.error);
        this.subjects = [];
      }
    );
    this.keyword = null;
  }

  //Take the subject and course entered and request backend for search
  baseSearch() {
    if(this.subIn) {
      if(this.crseIn) {
        this.authService.baseSearch("1", this.subIn.toUpperCase(), this.crseIn.toUpperCase())
        .subscribe(
          response => {
            this.subjects = response;
          },
          error => {
            alert(error.error);
            this.subjects = [];
          }
        );
        this.subIn = null;
        this.crseIn = null;
      } else {
        this.authService.baseSearch("1", this.subIn.toUpperCase(), null)
        .subscribe(
          response => {
            this.subjects = response;
          },
          error => {
            alert(error.error);
            this.subjects = [];
          }
        );
        this.subIn = null;
        this.crseIn = null;
      }
    }
    else {
      if(this.crseIn) {
        this.authService.baseSearch("2", this.crseIn.toUpperCase(), null)
        .subscribe(
          response => {
            this.subjects = response;
          },
          error => {
            alert(error.error);
            this.subjects = [];
          }
        );
        this.subIn = null;
        this.crseIn = null;        
      } else {
        this.authService.baseSearch("0", null, null)
        .subscribe(
          response => {
            this.subjects = response;
          },
          error => {
            alert(error.error);
            this.subjects = [];
          }
        );
        this.subIn = null;
        this.crseIn = null;
      }
    }
  }
  
  //Opens the popup which allows you to add a review to a course
  openReviewDialog(subject) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = subject;

    this.matDialog.open(ReviewPopupComponent, dialogConfig);
  }

  //Opens the popup which shows you more details about a course
  openDialog(subject) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = subject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }
}
