import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ValidateService } from './validate.service';
import { AuthService } from './auth.service';
import { CoursesComponent } from './courses/courses.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './auth.guard';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CoursesComponent,
    ListsComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule,
    NoopAnimationsModule,
    FormsModule
  ],
  providers: [ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
