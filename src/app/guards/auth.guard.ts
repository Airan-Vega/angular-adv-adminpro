import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.usuarioService.validarToken().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.usuarioService.validarToken().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
