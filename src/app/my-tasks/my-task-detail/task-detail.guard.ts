import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { userTasksService } from 'src/app/services/userTasks.service';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailGuard implements CanActivate {
  getMyInformationUrl: string = "https://www.esanlamlisinedir.com/wpjwt/wp-json/wp/v2/users/me";
  myTasksUrl: string = 'https://www.esanlamlisinedir.com/wpjwt/wp-json/wp/v2/task/';
  constructor(
    private httpClient: HttpClient,
    private tasksService: userTasksService, 
    private route: ActivatedRoute, 
    private router: Router,
    private loService: LoginService) {}

  public canViewTask(taskID) {
    let httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.loService.GetToken(),
        })
    }
    const promise1 = new Promise(
      (resolve1,reject1) => {
        this.httpClient.get<any>(this.getMyInformationUrl, httpOptions)
        .toPromise()
        .then(
          response1 => { 
            /* console.log(response1);
            resolve(response1); */
            const promise2 = new Promise(
              (resolve2,reject2) => {
                this.httpClient.get<any>(this.myTasksUrl+taskID, httpOptions)
                .pipe(
                  map(response => {
                      return response
                  }),
                  retry(1),
                )
                .toPromise()
                .then(
                  response2 => { 
                    /* console.log("response1,response2");
                    console.log(response1,response2); */
                    resolve1( {'userData':response1, 'taskData': response2});
                  },
                  msg => {
                    reject1(msg);
                  }
                );
              }
            )
            // return promise2;
          }
        )
      }
    )
    return promise1;
  }

  public  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let taskID = route.paramMap.get('id');
    return this.canViewTask(taskID)
    .then(
      (checkData: any) => {
        if(checkData) {
          if(checkData.userData.roles.indexOf('administrator') !== -1) {
            return true;
          } else {
            if(checkData.userData.id == checkData.taskData.author) {
              return true;
            } else {
              this.router.navigate(['my-tasks']);
              return false;
            }
          }
        } else {
          this.router.navigate(['login']);
          return false;
        }
      }
    ).catch(error => {
      console.error(error);
      this.router.navigate(['my-tasks']);
      return false;
    })
  
   }
   handleError(err) {
        if(err.status !== 200) {
            console.log('err!!!')
            // return throwError(err.status);
            return;
        }
  }
  
}
