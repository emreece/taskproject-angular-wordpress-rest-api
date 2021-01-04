import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() 'isLogin':boolean;
  @Input() 'userName' : string = '';
  loginStatusChanged: Subscription;
  taskStatuses: Array<any> = [];
  homeUrl: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private loService: LoginService) { }

  ngOnInit(): void {
    this.loginStatusChanged = this.loService.loginStatusChanged.subscribe(
      (isLoggedIn:boolean) => { 
          this.isLogin = isLoggedIn;
          if(this.isLogin == true) {
            this.homeUrl = 'my-tasks'
          } else {
            this.homeUrl = '/'
          }
      }
    ); 
   
    /* this.route.url.subscribe(url => {
    console.log(url);
    this.loginStatusChanged = this.loService.checkToken().subscribe(
      (isLoggedInData:any) => { 
          if(isLoggedInData.data.status == '200') {
            this.homeUrl = 'my-tasks'
          } else{
            this.homeUrl = '/'
          }
      }
    );
    }) */
  }
  
  onLogout(): void {
    this.isLogin = !this.loService.logout();
    if(!this.isLogin) {
      this.router.navigate(['/']);
    }
  }
}
