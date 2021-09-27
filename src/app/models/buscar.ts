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
