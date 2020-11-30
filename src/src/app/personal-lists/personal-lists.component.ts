import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { EditPopupComponent } from '../edit-popup/edit-popup.component';

@Component({
  selector: 'app-personal-lists',
  templateUrl: './personal-lists.component.html',
  styleUrls: ['./personal-lists.component.css']
})
export class PersonalListsComponent implements OnInit {
  timetables: [];
  selectedTimetable: any;
  constructor(private authService: AuthService, private matDialog: MatDialog) { }

  public ngOnInit(): void {
    this.getPersonalLists();
  }

  onSelect(timetable) {
    this.selectedTimetable = timetable;
  }

  removeSelect() {
    this.selectedTimetable = null;
  }

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

  openDialog(subject) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = subject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }

  openEditDialog(table) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = table;

    this.matDialog.open(EditPopupComponent, dialogConfig);
  }
}
