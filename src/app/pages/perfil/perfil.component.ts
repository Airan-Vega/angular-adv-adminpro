import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import {
  actualizarUsuarios,
  actualizarImageUsuarios,
} from '../../store/actions/usuarios.actions';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit, OnDestroy {
  perfilForm: FormGroup;
  userUId: string;
  urlImg: any;
  imagenSubir: File;
  google: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.userUId = this.usuarioService.usuario._id;
    this.store
      .select('usuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ nombre, email, img, google }) => {
        this.google = google;
        this.urlImg = this.usuarioService.getImageUsuario(img);
        this.perfilForm = this.fb.group({
          nombre: [nombre, [Validators.required]],
          email: [
            email,
            [
              Validators.required,
              Validators.pattern(
                '^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$'
              ),
            ],
          ],
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  actualizarPerfil() {
    const { nombre, email } = this.perfilForm.value;
    this.usuarioService
      .actualizarPerfil(this.perfilForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.store.dispatch(
            actualizarUsuarios({
              nombre,
              email,
            })
          );

          Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;
    if (!file) {
      this.store
        .select('usuario')
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ img }) => {
          this.urlImg = this.usuarioService.getImageUsuario(img);
        });
      return;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onload = () => {
      this.urlImg = reader.result;
    };
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.userUId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (img: string) => {
          this.store.dispatch(actualizarImageUsuarios({ img }));
          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        },
        (err) => {
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }
      );
  }
}
