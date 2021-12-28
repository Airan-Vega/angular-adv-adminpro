import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import {
  CargarHospital,
  CrearHospital,
} from '../interfaces/cargar-hospitales-interface';

const base_url = environment.base_url;

const url = `${base_url}/hospitales`;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
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

  cargarHospitales(desde: number = 0) {
    return this.http.get<CargarHospital>(`${url}?from=${desde}`, this.headers);
  }

  crearHospital(nombre: string) {
    return this.http.post<CrearHospital>(`${url}`, { nombre }, this.headers);
  }

  actualizarHospital(id: string, nombre: string) {
    return this.http.put(`${url}/${id}`, { nombre }, this.headers);
  }

  borrarHospital(id: string) {
    return this.http.delete(`${url}/${id}`, this.headers);
  }
}
