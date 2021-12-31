import { IUsuario } from './usuario';
import { IMedico } from './medico';
import { IHospital } from './hospital';
export interface IBuscarUsuario {
  ok: boolean;
  resultados: Resultado[];
  total: number;
}

interface Resultado {
  _id: string;
  role: string;
  google: boolean;
  terms: boolean;
  nombre: string;
  email: string;
  password: string;
  __v: number;
  img?: string;
}

export interface IBusquedaGlobal {
  usuarios: IUsuario[];
  medicos: IMedico[];
  hospitales: IHospital[];
}
