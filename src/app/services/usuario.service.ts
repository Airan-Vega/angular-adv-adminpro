import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { pluck, tap, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { ILoginForm } from '../models/login-form';
import { IRegisterForm } from '../models/register-form';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  auth2: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '303187043521-g7sjb481filbapmj67ifvjgp38dtnk30.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => this.router.navigateByUrl('/login'));
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        pluck('token'),
        tap((token: string) => localStorage.setItem('token', token)),
        map((token: string) => true),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: IRegisterForm): Observable<string> {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      pluck('token'),
      tap((resp: string) => localStorage.setItem('token', resp))
    );
  }

  login(formData: ILoginForm): Observable<string> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      pluck('token'),
      tap((resp: string) => localStorage.setItem('token', resp))
    );
  }

  loginGoogle(token): Observable<string> {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      pluck('token'),
      tap((resp: string) => localStorage.setItem('token', resp))
    );
  }
}
