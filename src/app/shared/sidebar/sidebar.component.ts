import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';

import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public imgUrl: string;
  public nombre: string;

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select('usuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ nombre, img }) => {
        this.imgUrl = this.usuarioService.getImageUsuario(img);
        this.nombre = nombre;
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
