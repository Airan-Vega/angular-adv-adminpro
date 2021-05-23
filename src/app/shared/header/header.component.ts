import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cargarUsuarios } from '../../store/actions/usuarios.actions';
import { AppState } from '../../store/app.reducers';

import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../models/usuario';

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
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(cargarUsuarios());
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
}
