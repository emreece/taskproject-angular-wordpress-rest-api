import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './services/login.service';
import { userData } from 'src/app/models/user.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'taskproject';
  isLoggedIn = false;
  loginStatusChanged: Subscription;
   // userData: string = '';
  userData = new userData();
  
  userChanged: Subscription;
/*   @Output() onLogin: EventEmitter<any> = new EventEmitter<any>(); */
  constructor( private loService: LoginService, private router: Router) {
    
  }
  ngOnInit():void {
        
        this.loginStatusChanged = this.loService.loginStatusChanged.subscribe(
          (isLoggedIn:boolean) => { 
              this.isLoggedIn = isLoggedIn
          }
        );
        
        this.userChanged = this.loService.userDataChanged.subscribe(
          (username:string) => { 
              console.log("username");
              console.log(username);
              this.userData.username = username;
          }
        );

        this.loService.checkToken().subscribe((data: any) => {
          if (data.data.status == '200') {
              this.isLoggedIn = true;
              this.loService.getMyInformations().subscribe(
                res => {
                 /* this.personModel.name = res.name;
                 this.personModel.image = res.avatar_urls[96] */
                 this.userData.username = res.name;
                 this.loService.userDataChanged.next(res.name);
                },
                error => {
                    console.log("error", error);
                    this.router.navigateByUrl('/');
                }
              );
          } else {
            this.isLoggedIn = false;
          }
        });   
  }
/*   public onLoginEvent(data: any):void {
    console.log('Data', data);
  } */
}
