import {  CanActivate,  ActivatedRouteSnapshot,  RouterStateSnapshot,  Router, CanActivateChild} from "@angular/router";
import { Injectable } from "@angular/core";
import { LoginService } from 'src/app/services/login.service';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {
  constructor(private LoginService: LoginService, private router: Router) {}
  isLogin:boolean;
  public  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let logged = this.LoginService.GetToken();
   /*  console.log(logged); */
    if (!logged) {
      this.router.navigate(["login"]);
      return false;
    }
    return this.LoginService.isAuthenticated()
    .then(
      (authenticated: boolean) => {
        /* console.log("authenticated");
        console.log(authenticated); */
        if(authenticated) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }
      }
    )   
   }
   canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);        
  }
}
/* export class LoginGuard implements CanActivateChild {
  constructor(private LoginService: LoginService, private router: Router) {}
  isLogin:boolean;
  public  canActivateChild (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let logged = this.LoginService.GetToken();
    if (logged) {
      return true;
    }
    this.router.navigate(["login"]);
    return false;   
   }
} */