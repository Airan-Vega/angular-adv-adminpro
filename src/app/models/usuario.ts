export interface IUsuario {
  nombre: string;
  email: string;
  password?: string;
  img?: string;
  google?: boolean;
  role?: string;
  uid?: string;
}
