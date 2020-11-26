import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
