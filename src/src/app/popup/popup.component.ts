import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  reviewsList = [];

  constructor(private authService: AuthService, public dialogRef: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  //Gets all the reviews for the course this popup was opened on
  ngOnInit(): void {
    this.authService.getReviews(String(this.data.subject), String(this.data.catalog_nbr))
    .subscribe(
      response => {
        response.forEach(e => {
          this.reviewsList.push(e);
        });
        console.log(this.reviewsList);
      },
      error => {
        alert(error.error);
      }
    );
  }

  //Closes popup
  close() {
    this.dialogRef.close();
  }
}
