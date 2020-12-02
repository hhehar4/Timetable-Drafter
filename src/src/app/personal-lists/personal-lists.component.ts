import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { EditPopupComponent } from '../edit-popup/edit-popup.component';
import { CreatePopupComponent } from '../create-popup/create-popup.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
  selector: 'app-personal-lists',
  templateUrl: './personal-lists.component.html',
  styleUrls: ['./personal-lists.component.css']
})
export class PersonalListsComponent implements OnInit {
  timetables: [];
  selectedTimetable: any;
  constructor(private authService: AuthService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getPersonalLists();
  }

  onSelect(timetable) {
    this.selectedTimetable = timetable;
  }

  removeSelect() {
    this.selectedTimetable = null;
  }

  //Gets all the user's lists from backend
  getPersonalLists() {
    this.authService.getPersonalLists()
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

  //Opens popup to show details on courses within the lists
  openDialog(subject) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = subject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }

  //Opens popup to create new list
  openCreateDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.matDialog.open(CreatePopupComponent, dialogConfig);
  }

  //Opens popup to edit a list
  openEditDialog(table) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = table;

    this.matDialog.open(EditPopupComponent, dialogConfig);
  }

  //Opens popup to confirm deleting a list
  openDeleteDialog(table) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = table;

    this.matDialog.open(DeletePopupComponent, dialogConfig);
  }
}
