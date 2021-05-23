import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';

export interface AppState {
  usuario: reducers.UsuariosState;
}

export const appReducers: ActionReducerMap<AppState> = {
  usuario: reducers.usuariosReducer,
};
