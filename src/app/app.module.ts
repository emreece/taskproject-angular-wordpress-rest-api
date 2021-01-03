import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import your library
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HeaderComponent } from './parts/header/header.component';
import { FooterComponent } from './parts/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { MyTaskDetailComponent } from './my-tasks/my-task-detail/my-task-detail.component';
import { MyTasksHomeComponent } from './my-tasks/my-tasks-home/my-tasks-home.component';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MyTaskCreateComponent } from './my-tasks/my-task-create/my-task-create.component';
import { LoginGuard } from "./login/login.guard";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    WelcomeComponent,
    MyTasksComponent,
    MyTaskDetailComponent,
    MyTasksHomeComponent,
    MyTaskCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [LoginService, LoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
