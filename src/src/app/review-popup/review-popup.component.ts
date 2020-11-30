import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-review-popup',
  templateUrl: './review-popup.component.html',
  styleUrls: ['./review-popup.component.css']
})
export class ReviewPopupComponent implements OnInit {
  tempData: any;
  ratingVals = [1, 2, 3, 4, 5];

  constructor(private authService: AuthService, public dialogRef: MatDialogRef<ReviewPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.tempData = {
      "review": "",
      "rating": 0,
      "subject": this.data.subject,
      "catalog_nbr": this.data.catalog_nbr
    }
  }

  save() {
    this.authService.createReview(this.tempData)
    .subscribe(
      response => {
        alert("Review Added successfully");
        this.close();
      },
      error => {
        alert(error.error);
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
