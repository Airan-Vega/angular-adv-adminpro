import { createAction, props } from '@ngrx/store';
import { IUsuario } from '../../models/usuario';

export const cargarUsuarios = createAction('[Usuarios] Cargar Usuarios');
export const cargarUsuariosSuccess = createAction(
  '[Usuarios] Cargar Usuarios Success',
  props<{ usuarios: IUsuario }>()
);
export const actualizarUsuarios = createAction(
  '[Usuarios] Actualizar Usuarios',
  props<{ nombre: string; email: string }>()
);

export const actualizarImageUsuarios = createAction(
  '[Usuarios] Actualizar Imagen Usuarios',
  props<{ img: string }>()
);

export const cerrarUsuariosSuccess = createAction(
  '[Usuarios] Cerrar Usuarios Success'
);
