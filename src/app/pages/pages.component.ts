import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { cargarUsuarios } from '../store/actions/usuarios.actions';
// Llamamos una funcion que se encuentra de manera global en la aplicacion
declare function customInitFunctions(): any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(cargarUsuarios());
    customInitFunctions();
  }
}
