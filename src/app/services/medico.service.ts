import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { IMedico } from '../models/medico';
import { map } from 'rxjs/operators';
import {
  CargarMedico,
  CrearMedico,
} from '../interfaces/cargar-medicos-interface';

const base_url = environment.base_url;

const url = `${base_url}/medicos`;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  cargarMedicos(desde: number = 0) {
    return this.http.get<CargarMedico>(`${url}?from=${desde}`, this.headers);
  }

  obtenerMedicoPorId(id: string) {
    return this.http
      .get(`${url}/${id}`, this.headers)
      .pipe(map((resp: { ok: boolean; medico: IMedico }) => resp.medico));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    return this.http.post<CrearMedico>(`${url}`, medico, this.headers);
  }

  actualizarMedico(medico: IMedico) {
    return this.http.put(`${url}/${medico._id}`, medico, this.headers);
  }

  borrarMedico(id: string) {
    return this.http.delete(`${url}/${id}`, this.headers);
  }
}
