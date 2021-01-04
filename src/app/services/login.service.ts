import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { Person } from 'src/Model/person';
import { Observable, Subject, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginService {
    loginUrl: string = "https://www.esanlamlisinedir.com/wpjwt/wp-json/jwt-auth/v1/token";
    checkTokenUrl: string = "https://www.esanlamlisinedir.com//wpjwt/wp-json/jwt-auth/v1/token/validate/";
    getMyInformationUrl: string = "https://www.esanlamlisinedir.com/wpjwt/wp-json/wp/v2/users/me";
    loginStatusChanged = new Subject<boolean>();
    userDataChanged = new Subject<string>(); 
    constructor(private httpClient: HttpClient) { }

    GetToken(): string | boolean {
        if (window.localStorage.getItem("token") != null) {
            return window.localStorage.getItem("token");
        } else {
            return false;
        }
    }

    public checkTokenTime() {
       //  debugger;
        if (window.localStorage.getItem("createdDate") != null) {
            var createdDate = new Date(window.localStorage.getItem("createdDate"));
            var now = new Date();
            var difference = now.getTime() - createdDate.getTime();
            var resultInMinutes = Math.round(difference / 60000);
            return resultInMinutes > 1;  //45 olacak
        }
        else {
            return true;
        }
    }
    public logout() {
        this.loginStatusChanged.next(false);
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("createdDate");
        return true;
    }
    public getMyInformations(): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken()
            }),
            observe: 'response' as 'body',
        }
        return this.httpClient.get<any>(this.getMyInformationUrl, httpOptions)
            .pipe(
                map(response => {
                    var token = response.headers.get('token');
                    var refreshToken = response.headers.get('refreshToken');
                    // debugger;
                    if (token && refreshToken) {
                        console.log("Token :" + token);
                        console.log("RefreshToken :" + refreshToken);
                        window.localStorage.setItem("token", token);
                        window.localStorage.setItem("refreshToken", refreshToken);
                        window.localStorage.setItem("createdDate", new Date().toString());
                    }
                    // console.log(response.body);
                    return response.body;
                }),
                retry(1),
                catchError(this.errorHandel)
            )
    }

    public login(userName: string, Password: string): Observable<object> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.httpClient.post<object>(this.loginUrl, { username: userName, password: Password}, httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandel)
            )
    }

    public checkToken(): Observable<object> {
        //console.log('token:'+this.GetToken());
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
            })
        }
        return this.httpClient.post<object>(this.checkTokenUrl,'', httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleAuthError)
            )
    }
    isAuthenticated() {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.GetToken(),
            })
        }
        const promise = new Promise(
          (resolve,reject) => {
            resolve(this.httpClient.post<object>(this.checkTokenUrl,'', httpOptions)
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