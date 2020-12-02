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

  //Get the names of all the lists the user currently has
  getPersonalListNames() {
    this.authService.getPersonalLists()
    .subscribe(
      response => {
        response.forEach(e => {
          this.listNames.push(e.timetable_name);
        });
      },
      error => {
        this.listNames = [];
      }
    );
  }

  //Saves the user's new list
  save() {
      //Ensures the list name doesn't conflict with existing lists for the same user
      this.getPersonalListNames();
      const nameCheck = this.listNames.find(e => String(e) == String(this.tempData.timetable_name));
      if(String(this.tempData.timetable_name) != "") {
          if(nameCheck) {
            alert("Timetable with same name already exists.");
          }
          else {
            try {
              for(let i = 0; i < this.tempCourses.length; i ++) {
                //Verifies all entered courses exist then send the backend a request to create the table
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
                alert("Please enter at least 1 course.")
              }
            } catch(e) {
            }
          }
        }
      else {
        alert("Enter a unique timetable name.");
      }
  }

  //Creates a new spot to add a course
  addCourse() {
    this.tempData.courses.push({});
  }

  //Removes a course from the list
  removeCourse(course) {
    this.tempData.courses.splice(this.tempData.courses.indexOf(course), 1);
  }

  //Closes the popup
  close() {
    this.dialogRef.close();
  }
}
