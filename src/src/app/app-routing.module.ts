import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ListsComponent } from './lists/lists.component';
import { PersonalListsComponent } from './personal-lists/personal-lists.component';
import { AuthGuard } from './auth.guard';

//Add canActivate:[AuthGuard] as extra parameter to restricted routes
const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'lists', component: ListsComponent},
  {path:'personalLists', component: PersonalListsComponent, canActivate:[AuthGuard]},
  {path:'courses', component: CoursesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
