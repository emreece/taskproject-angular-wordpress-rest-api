import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
      const token = localStorage.getItem("token");
      let newRequest: HttpRequest<any>;
      if (request.url != "https://www.esanlamlisinedir.com/wpjwt/wp-json/jwt-auth/v1/token") {
          newRequest = request.clone({
              headers: request.headers.set("Authorization", `Bearer ${token}`)
          });
      } else
          newRequest = request.clone();

        return next.handle(newRequest).pipe(
          tap(
            /* event => console.log(event),
            error => console.log(error), */
          )
        ); 
  }
}