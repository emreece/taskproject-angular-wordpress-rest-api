import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { Person } from 'src/Model/person';
import { Observable, Subject, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { LoginService } from './login.service';
import { newTaskData, taskData } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class userTasksService {
    myTasksUrl: string = 'https://www.esanlamlisinedir.com/wpjwt/wp-json/wp/v2/task/';
    taskCategoriesUrl: string = 'https://www.esanlamlisinedir.com/wpjwt/wp-json/wp/v2/categories/'
    tasks : Array<taskData> = [];
    constructor(private httpClient: HttpClient, private loService: LoginService) { }

    public getMyTasks(catID:number, status?:string): Observable<any> {
        let that = this
        this.tasks = [];
        let catQuery: string = '';
        if(typeof catID != 'undefined') {
            catQuery = '?categories='+catID;
        }
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
        return this.httpClient.get<any>(this.myTasksUrl+catQuery, httpOptions)
            .pipe(
                map(response => {
               /*      console.log(response.body); */
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
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
        return this.httpClient.get<any>(this.myTasksUrl + id.toString(), httpOptions)
            .pipe(
                map(response => {
                    console.log("getPost",response.body);
                    return response.body;
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }
    public getCategory(catID:number): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
        return this.httpClient.get<any>(this.taskCategoriesUrl+catID, httpOptions)
            .pipe(
                map(response => {
                    return response.body
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }
    public getCategories(): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
        return this.httpClient.get<any>(this.taskCategoriesUrl + '?orderby=id', httpOptions)
            .pipe(
                map(response => {
                   /*  console.log("categoryData", response.body); */
                    return response.body
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }
    public updateTaskStatus(taskID: number, taskCategory: number): Observable<any> { 
        console.log('updateTaskStatus');
        let taskData = { id:taskID, categories:[taskCategory] };
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
        return this.httpClient.post<any>(this.myTasksUrl+taskID, taskData, httpOptions)
            .pipe(
                map(response => {
                    console.log("categoryData", response.body);
                    return response.body
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }
    public updateTask(taskData: taskData): Observable<any> { 
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
       
        return this.httpClient.post<any>(this.myTasksUrl+taskData.taskID, taskData, httpOptions)
            .pipe(
                map(response => {
                    // console.log("updateTask", response.body);
                    return response.body
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }
    public createTask(taskData: newTaskData): Observable<any> { 
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken()
            }),
            observe: 'response' as 'body',
        }
       
        return this.httpClient.post<any>(this.myTasksUrl, taskData, httpOptions)
            .pipe(
                map(response => {
                    return response.body
                }),
                retry(1),
                // catchError(this.errorHandel)
            )
    }

    public canViewTask(taskID) {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.loService.GetToken(),
            })
        }
        const promise = new Promise(
            (resolve,reject) => {
            resolve(this.httpClient.get<object>(this.myTasksUrl + taskID, httpOptions)
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
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
    handleAuthError(err) {
        if(err.status === 401 || err.status === 403) {
            return throwError(err.status);
        }
    }

}