import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm', {static:false}) loginForm: NgForm;
  @ViewChild('errorMessageElement', {static:false}) errorMessageElement: ElementRef;
  loginError: boolean = false;
  loginErrorMessage: string = '';
  constructor(private loService: LoginService, private router: Router, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loService.checkToken().subscribe((data: any) => {
        if (data.data.status == '200') {
            this.router.navigate(['my-tasks']);
        }
    });
  }

  onLoginSubmit() {
    this.loService.login(this.loginForm.value.username,this.loginForm.value.password).subscribe((data: any) => {
      this.loService.loginStatusChanged.next(true);
      console.log("onLoginSubmit");
      console.log(data);
      this.loService.userDataChanged.next(data);
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("refreshToken", data.token);
      window.localStorage.setItem("createdDate", new Date().toString());
      this.router.navigate(['my-tasks']);
    },
    error => {
      this.loginError = true;
      this.changeDetectorRef.detectChanges();
      this.loginErrorMessage = "<span>Check your login information. <br> username: admin password:12345</span>";
      this.errorMessageElement.nativeElement.innerHTML = this.loginErrorMessage;
    })
  }

}
