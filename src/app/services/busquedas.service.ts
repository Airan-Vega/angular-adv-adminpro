import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBuscarUsuario, IBusquedaGlobal } from '../models/buscar';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  busquedaGlobal(termino: string) {
    return this.http.get<IBusquedaGlobal>(
      `${base_url}/todo/${termino}`,
      this.headers
    );
  }

  buscar(
    tipo: 'Usuario' | 'Medico' | 'Hospital',
    termino: string,
    desde: number = 0
  ) {
    return this.http
      .get<IBuscarUsuario>(
        `${base_url}/todo/coleccion/${tipo}/${termino}?from=${desde}`,
        this.headers
      )
      .pipe(map(({ total, resultados }) => ({ total, resultados })));
  }
}
