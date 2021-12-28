import { IHospital } from '../models/hospital';
export interface CargarHospital {
  total: number;
  hospitales: IHospital[];
}

export interface CrearHospital {
  hospital: IHospital;
}
