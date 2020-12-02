import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-popup',
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.css']
})
export class EditPopupComponent implements OnInit {
  tempData: any;
  listNames = [];
  newCourses = [];
  tempCourses = [];

  constructor(private authService: AuthService, public dialogRef: MatDialogRef<EditPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.tempData = JSON.parse(JSON.stringify(this.data));
    this.tempCourses = this.tempData.courses;
  }

  //Gets all list names for current user
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

  //Saves the updated list
  save() {
    //Checks if the new list name is altered and if it conflicts with any existing names
    this.getPersonalListNames();
    if(String(this.tempData.timetable_name) != (String(this.data.timetable_name))) {
      const nameCheck = this.listNames.find(e => String(e) == String(this.tempData.timetable_name));
      if(String(this.tempData.timetable_name) != "") {
          if(nameCheck) {
            alert("Timetable with same name already exists.");
          }
          else {
            try { 
              //Verify all courses exist then send backend a request to update the table
              for(let i = 0; i < this.tempCourses.length; i ++) {
                this.authService.verifyCourse(String(this.tempCourses[i].subject).toUpperCase(), String(this.tempCourses[i].catalog_nbr).toUpperCase())
                .subscribe(
                  response => { 
                    this.newCourses.push(response[0]);
                    if(i == this.tempCourses.length - 1) {
                      this.authService.updateTimetable(this.tempData, this.newCourses, this.data.timetable_name)
                      .subscribe(
                        response => {
                          alert(`Table updated successfully`);
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
                this.authService.updateTimetable(this.tempData, this.newCourses, this.data.timetable_name)
                .subscribe(
                  response => {
                    alert(`Table updated successfully`);
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
    } else {
        try { 
          for(let i = 0; i < this.tempCourses.length; i ++) {
            this.authService.verifyCourse(String(this.tempCourses[i].subject).toUpperCase(), String(this.tempCourses[i].catalog_nbr).toUpperCase())
            .subscribe(
              response => { 
                this.newCourses.push(response[0]);
                if(i == this.tempCourses.length - 1) {
                  this.authService.updateTimetable(this.tempData, this.newCourses, this.data.timetable_name)
                  .subscribe(
                    response => {
                      alert(`Table updated successfully`);
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
            console.log("test");
            this.authService.updateTimetable(this.tempData, this.newCourses, this.data.timetable_name)
            .subscribe(
              response => {
                alert(`Table updated successfully`);
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

  //Add a new course row
  addCourse() {
    this.tempData.courses.push({});
  }

  //Remove course from list
  removeCourse(course) {
    this.tempData.courses.splice(this.tempData.courses.indexOf(course), 1);
  }

  //Close popup
  close() {
    this.dialogRef.close();
  }
}
