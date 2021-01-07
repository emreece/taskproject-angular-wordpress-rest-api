import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailGuard implements CanActivate {
  getMyInformationUrl: string = environment.getMyInformationUrl;
  myTasksUrl: string = environment.myTasksUrl;
  constructor(
    private httpClient: HttpClient,
    private router: Router) {}

  public canViewTask(taskID) {
    const promise1 = new Promise(
      (resolve1,reject1) => {
        this.httpClient.get<any>(this.getMyInformationUrl)
        .toPromise()
        .then(
          response1 => { 
            const promise2 = new Promise(
              (resolve2,reject2) => {
                this.httpClient.get<any>(this.myTasksUrl+taskID)
                .pipe(
                  map(response => {
                      return response
                  }),
                  retry(1),
                )
                .toPromise()
                .then(
                  response2 => { 
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
            console.log(err)
            // return throwError(err.status);
            return;
        }
  }
  
}
