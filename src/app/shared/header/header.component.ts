import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';

import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit, OnDestroy {
  imgUrl: string;
  usuario: IUsuario;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private usuarioService: UsuarioService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .select('usuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ nombre, email, img }) => {
        this.imgUrl = this.usuarioService.getImageUsuario(img);
        this.usuario = {
          nombre,
          email,
        };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    if (termino.length === 0) return;
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
