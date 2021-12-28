import { IMedico } from '../models/medico';

export interface CargarMedico {
  total: number;
  medicos: IMedico[];
}

export interface CrearMedico {
  medico: IMedico;
}
