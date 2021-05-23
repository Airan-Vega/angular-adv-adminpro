import { createReducer, on } from '@ngrx/store';

import {
  cargarUsuarios,
  cargarUsuariosSuccess,
  actualizarUsuarios,
  actualizarImageUsuarios,
  cerrarUsuariosSuccess,
} from '../actions';

export interface UsuariosState {
  nombre: string;
  email: string;
  terms?: boolean;
  img?: string;
  google?: boolean;
  role?: string;
  uid?: string;
}

const usuariosInitialState: UsuariosState = {
  nombre: '',
  email: '',
  terms: false,
  img: '',
  google: false,
  role: '',
  uid: '',
};

const _usuariosReducer = createReducer(
  usuariosInitialState,
  on(cargarUsuarios, (state) => ({ ...state })),
  on(cargarUsuariosSuccess, (state, { usuarios }) => ({
    ...state,
    nombre: usuarios.nombre,
    email: usuarios.email,
    terms: usuarios.terms,
    img: usuarios.img,
    google: usuarios.google,
    role: usuarios.role,
    uid: usuarios.uid,
  })),
  on(actualizarUsuarios, (state, { nombre, email }) => ({
    ...state,
    nombre,
    email,
  })),
  on(actualizarImageUsuarios, (state, { img }) => ({
    ...state,
    img,
  })),
  on(cerrarUsuariosSuccess, (state) => ({
    ...state,
    nombre: '',
    email: '',
    img: '',
    google: false,
    role: '',
    uid: '',
  }))
);

export function usuariosReducer(state, action) {
  return _usuariosReducer(state, action);
}
