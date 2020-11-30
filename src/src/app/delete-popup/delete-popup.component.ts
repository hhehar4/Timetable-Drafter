import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {
  constructor(private authService: AuthService, public dialogRef: MatDialogRef<DeletePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  confirm() {
    this.authService.deleteTimetable(this.data.timetable_name)
    .subscribe(
      response => {
        alert("Table removed successfully");
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
