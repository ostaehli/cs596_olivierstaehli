import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private router: Router) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (this.isAuthRoute(req.url)) { 
      return next.handle(req);
    }
    if (!req.url.startsWith('https://api.synature.ch/')) {
      return next.handle(req);
    }
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    })

    return next.handle(req).pipe(catchError(err => {
      if ((err.status === 401 || err.status === 403) && !this.isAuthRoute(req.url) && req.url.startsWith('https://api.synature.ch:443/api/')) {
        this.authService.refreshToken().then( success => {
          if (success) {
            next.handle(req);
            return of([]);
          }
          return of(err);
        }).catch(err => {
          this.router.navigate(['/login']);
          return of(err);
        });
      }
      return of(err);
    }));
  }

  isAuthRoute(url: string): boolean {
    return url.includes('/login') || url.includes('signup') || url.includes('token/refresh');
  }
}
