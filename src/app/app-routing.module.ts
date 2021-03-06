import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';
import { MyTaskCreateComponent } from './my-tasks/my-task-create/my-task-create.component';
import { MyTaskDetailComponent } from './my-tasks/my-task-detail/my-task-detail.component';
import { TaskDetailGuard } from './my-tasks/my-task-detail/task-detail.guard';
import { MyTasksHomeComponent } from './my-tasks/my-tasks-home/my-tasks-home.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';

const routes: Routes = [
  {'path': '', component: LoginComponent, pathMatch:'full'},
  {'path': 'login', component: LoginComponent},
  {'path': 'my-tasks', component: MyTasksComponent,  canActivateChild: [LoginGuard],  children: [
    {'path':'', component: MyTasksHomeComponent },
    {'path':'create', component: MyTaskCreateComponent },
    {'path':':id', component: MyTaskDetailComponent, canActivate:[TaskDetailGuard] },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
