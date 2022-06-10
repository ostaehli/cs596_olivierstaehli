import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Token {
  message:string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  debugToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  private apiUrl = 'https://api.synature.ch:443/api/accounts';
  private refreshTimeout: ReturnType<typeof setTimeout> | null = null;

  login(email: string, password: string): Promise<boolean>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': 'application/json' }) };
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + '/login';
      this.httpClient.post<Token>(url, {email: email, password: password}, httpOptions).subscribe(
        {
          next: (data) => { this.setCookiesFromData(data); resolve(true)},
          error: (err) => { console.error(err); reject(err)}
        }
      );
    });
  }

  signup(firstName: string, lastName: string, email: string, password: string, countryId: string): Promise<boolean> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'accept': 'application/json' }) };
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + '/register';
      this.httpClient.post<Token>(url, {firstName: firstName, lastName: lastName, email: email, password: password, countryId: countryId}, httpOptions).subscribe(
        {
          next: (data) => { console.log(data);this.setCookiesFromData(data); resolve(true)},
          error: (err) => { console.error(err); reject(err)}
        }
      );
    });
  }

  logout(): void {
    console.log('logging out');
    this.setCookie('token', '', new Date());
    this.setCookie('refreshToken', '', new Date());
    window.location.reload();
  }

  getToken(): string {
    return this.readCookie('token')
  }

  isLoggedIn(): boolean {
    return this.readCookie('token').length > 0;
  }

  refreshToken(): Promise<boolean> {
    if (this.readCookie('token') === "") {
      return new Promise((_, reject) => {
        reject(false);
      });
    }
    const httpOptions = { headers: new HttpHeaders({ Authorization: `Bearer ${this.readCookie('refreshToken')}`, 'Content-Type': 'application/json', 'accept': 'application/json' }) };
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + '/token/refresh';
      this.httpClient.get<Token>(url, httpOptions).subscribe(
        {
          next: (data) => { this.setCookiesFromData(data); resolve(true)},
          error: (err) => { console.error(err); reject(err)}
        }
      );
    });
  }

  setRefreshTimeoutFromCookieIfLoggedIn(): void {
    if (this.isLoggedIn()) {
      const expires: Date = new Date(this.readCookie('tokenExpires'));
      let timeDelta = expires.getTime() - Date.now();
      timeDelta /= 1000;
      timeDelta = Math.max(timeDelta, 0);
      this.setRefreshTimeout(timeDelta);
    }
  }

  private setCookiesFromData(data: Token) {
    let expirationDate = new Date();
    expirationDate = new Date(expirationDate.setSeconds(expirationDate.getSeconds() + data.expiresIn));
    this.setCookie('token', data.accessToken, expirationDate);
    this.setCookie('refreshToken', data.refreshToken, expirationDate);
    this.setCookie('tokenExpires', expirationDate.toUTCString(), expirationDate);
    this.setRefreshTimeout(data.expiresIn);
  }

  private setRefreshTimeout(expirationSeconds: number) {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    this.refreshTimeout = setTimeout(() => this.refreshToken(), (expirationSeconds-60)*1000);
  }

  private readCookie(name: string): string {
    let cookieStr = document.cookie;
    let cookies = cookieStr.split(";");
    for (let cookie of cookies) {
      let cookieName = cookie.split("=")[0].trim();
      if (cookieName === name) {
        return cookie.split("=")[1];
      }
    }
    return "";
  }

  private setCookie(name: string, value: string, expires?: Date): void {
    let cookieStr = name + "=" + value;
    cookieStr += ";SameSite=Strict";
    if (expires) {
      cookieStr += ";expires=" + expires.toUTCString();
    }
    document.cookie = cookieStr;
  }
}
