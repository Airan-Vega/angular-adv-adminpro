import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';
import { ILoginForm } from '../models/login-form';
import { IRegisterForm } from '../models/register-form';
import { IUsuario } from '../models/usuario';
import { CargarUsuario } from '../interfaces/cargar-usuarios-interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  auth2: any;
  usuario: IUsuario;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario._id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
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
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        this.usuario = resp.usuario;
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError((error) => of(false))
    );
  }

  getUserAuth() {
    return of(this.usuario);
  }

  crearUsuario(formData: IRegisterForm): Observable<any> {
    return this.http
      .post(`${base_url}/usuarios`, formData)
      .pipe(map((resp: any) => localStorage.setItem('token', resp.token)));
  }

  actualizarPerfil(data: IUsuario) {
    data = {
      ...data,
      role: this.usuario.role,
    };
    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  login(formData: ILoginForm): Observable<any> {
    return this.http
      .post(`${base_url}/login`, formData)
      .pipe(map((resp: any) => localStorage.setItem('token', resp.token)));
  }

  loginGoogle(token): Observable<any> {
    return this.http
      .post(`${base_url}/login/google`, { token })
      .pipe(map((resp: any) => localStorage.setItem('token', resp.token)));
  }

  getImageUsuario(image: string) {
    if (!image) {
      return `${base_url}/upload/usuarios/no-image`;
    } else if (image && image.includes('google')) {
      return image;
    } else if (image) {
      return `${base_url}/upload/usuarios/${image}`;
    }
  }

  cargarUsuarios(desde: number = 0) {
    return this.http.get<CargarUsuario>(
      `${base_url}/usuarios?from=${desde}`,
      this.headers
    );
  }

  eliminarUsuario(id: string) {
    return this.http.delete(`${base_url}/usuarios/${id}`, this.headers);
  }

  actualizarUsuario(usuario: IUsuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario._id}`,
      usuario,
      this.headers
    );
  }
}
