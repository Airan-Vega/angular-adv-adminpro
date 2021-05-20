import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {
    const formData = new FormData();
    formData.append('imagen', archivo);

    return this.http
      .put(`${base_url}/upload/${tipo}/${id}`, formData, {
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
      })
      .pipe(
        map((data: any) => {
          if (data.ok) {
            return data.nombreArchivo;
          } else {
            return false;
          }
        }),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }
}
