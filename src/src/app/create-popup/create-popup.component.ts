import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-popup',
  templateUrl: './create-popup.component.html',
  styleUrls: ['./create-popup.component.css']
})
export class CreatePopupComponent implements OnInit {
  constructor(private authService: AuthService, public dialogRef: MatDialogRef<CreatePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  tempData: any;
  listNames = [];
  newCourses = [];
  tempCourses = [];


  ngOnInit(): void {
    this.tempData = {
      "timetable_name": "",
      "creator_name": this.authService.user.name,
      "creator_email":this.authService.user.email,
      "last_updated": "",
      "public": false,
      "description": "",
      "courses": []
    }
    this.tempCourses = this.tempData.courses;
  }

  getPersonalListNames() {
    this.authService.getPersonalLists()
    .subscribe(
      response => {
        response.forEach(e => {
          this.listNames.push(e.timetable_name);
        });
      },
      error => {
        alert(error.error);
        this.listNames = [];
      }
    );
  }

  save() {
      this.getPersonalListNames();
      const nameCheck = this.listNames.find(e => String(e) == String(this.tempData.timetable_name));
      if(String(this.tempData.timetable_name) != "") {
          if(nameCheck) {
            alert("Timetable with same name already exists.");
          }
          else {
            try {
              for(let i = 0; i < this.tempCourses.length; i ++) {
                this.authService.verifyCourse(String(this.tempCourses[i].subject).toUpperCase(), String(this.tempCourses[i].catalog_nbr).toUpperCase())
                .subscribe(
                  response => { 
                    this.newCourses.push(response[0]);
                    if(i == this.tempCourses.length - 1) {
                      this.authService.createTimetable(this.tempData, this.newCourses)
                      .subscribe(
                        response => {
                          alert(`Table added successfully`);
                          this.close();
                        },
                        error => {
                          alert(error.error);
                        }
                      ); 
                    }
                  },
                  error => {
                    this.newCourses = [];
                  }
                )
              }
              if(this.tempCourses.length == 0) {
                this.authService.createTimetable(this.tempData, this.newCourses)
                .subscribe(
                  response => {
                    alert(`Table added successfully`);
                    this.close();
                  },
                  error => {
                    alert(error.error);
                  }
                ); 
              }
            } catch(e) {
            }
          }
        }
      else {
        alert("Enter a unique timetable name.");
      }
  }

  addCourse() {
    this.tempData.courses.push({});
  }

  removeCourse(course) {
    this.tempData.courses.splice(this.tempData.courses.indexOf(course), 1);
  }

  close() {
    this.dialogRef.close();
  }
}
