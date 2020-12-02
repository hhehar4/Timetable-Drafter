import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  timetables: [];
  selectedTimetable: any;
  constructor(private authService: AuthService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getPublicLists();
  }

  onSelect(timetable) {
    this.selectedTimetable = timetable;
  }

  removeSelect() {
    this.selectedTimetable = null;
  }

  //Request backend for 10 most recently updated public lists
  getPublicLists() {
    this.authService.getPublicLists()
    .subscribe(
      response => {
        this.timetables = response;
      },
      error => {
        alert(error.error);
        this.timetables = [];
      }
    );
  }

  //Opens the popup to show more details of a course within the list
  openDialog(subject) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = subject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }
}
