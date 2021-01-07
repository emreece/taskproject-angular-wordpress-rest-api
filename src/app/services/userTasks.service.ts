import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { LoginService } from './login.service';
import { newTaskData, taskData } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class userTasksService {
    myTasksUrl: string = environment.myTasksUrl;
    taskCategoriesUrl: string = environment.taskCategoriesUrl;
    tasks : Array<taskData> = [];
    constructor(private httpClient: HttpClient, private loService: LoginService) { }

    public getMyTasks(catID:number, status?:string): Observable<any> {
        let that = this
        this.tasks = [];
        let catQuery: string = '';
        if(typeof catID != 'undefined') {
            catQuery = '?categories='+catID;
        }
        return this.httpClient.get<any>(this.myTasksUrl+catQuery, {observe: 'response'})
            .pipe(
                map(response => {
                    response.body.forEach(function(task){
                        let newtask = new taskData();
                        newtask = {title: task.title, taskID: task.id, content: task.content, categories: task.categories};
                        that.tasks.push(newtask)
                    });
                    return this.tasks;
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }
    public getMyTask(id: Number) : Observable<any> {
        return this.httpClient.get<any>(this.myTasksUrl + id.toString(), {observe: 'response'})
            .pipe(
                map(response => {
                    return response.body;
                }),
                retry(1),
            )
    }
    public getCategory(catID:number): Observable<any> {
        return this.httpClient.get<any>(this.taskCategoriesUrl+catID, {observe: 'response'})
            .pipe(
                map(response => {
                    return response.body
                }),
                retry(1),
            )
    }
    public getCategories(): Observable<any> {
        return this.httpClient.get<any>(this.taskCategoriesUrl + '?orderby=id', {observe: 'response'})
            .pipe(
                map(response => {
                    return response.body
                }),
                retry(1),
            )
    }
    public updateTaskStatus(taskID: number, taskCategory: number): Observable<any> { 
        let taskData = { id:taskID, categories:[taskCategory] };
        return this.httpClient.post<any>(this.myTasksUrl+taskID, taskData, {observe: 'response'})
            .pipe(
                map(response => {
                    console.log("categoryData", response.body);
                    return response.body
                }),
                retry(1),
            )
    }
    public updateTask(taskData: taskData): Observable<any> { 
        return this.httpClient.post<any>(this.myTasksUrl+taskData.taskID, taskData, {observe: 'response'})
            .pipe(
                map(response => {
                    return response.body
                }),
                retry(1),
            )
    }
    public createTask(taskData: newTaskData): Observable<any> { 
        return this.httpClient.post<any>(this.myTasksUrl, taskData, {observe: 'response'})
            .pipe(
                map(response => {
                    return response.body
                }),
                retry(1),
            )
    }

    public canViewTask(taskID) {
        const promise = new Promise(
            (resolve,reject) => {
            resolve(this.httpClient.get<object>(this.myTasksUrl + taskID)
            .pipe(
                retry(1),
                catchError(this.handleAuthError)
            ))
            }
        )
        return promise;
    }

    errorHandel(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;  // Get client-side error
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; // Get server-side error
        }
        return throwError(errorMessage);
    }
    handleAuthError(err) {
        if(err.status === 401 || err.status === 403) {
            return throwError(err.status);
        }
    }

}