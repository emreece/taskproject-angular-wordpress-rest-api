import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { userTasksService } from 'src/app/services/userTasks.service';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailGuard implements CanActivate {
  constructor(private tasksService: userTasksService, private route: ActivatedRoute, private router: Router) {}
  public  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let taskID = route.paramMap.get('id');
    return this.tasksService.canViewTask(taskID)
    .then(
      (canView: boolean) => {
        if(canView) {
          console.log("can't view!");
          this.router.navigate(['my-tasks']);
          return false;
        } else {
          this.router.navigate(['my-tasks']);
          return false;
        }
      }
    )   
   }
  
}
