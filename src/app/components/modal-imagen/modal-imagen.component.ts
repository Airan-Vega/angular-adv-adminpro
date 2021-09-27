import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../services/modal-imagen.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { actualizarImageUsuarios } from '../../store/actions/usuarios.actions';

import Swal from 'sweetalert2';

import { AppState } from '../../store/app.reducers';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
})
export class ModalImagenComponent implements OnInit {
  urlImg: any;
  imagenSubir: File;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public modalImagenService: ModalImagenService,
    private store: Store<AppState>,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.urlImg = null;
    this.modalImagenService.cerrarModal();
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
    const { id, tipo } = this.modalImagenService;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (img: string) => {
          this.store.dispatch(actualizarImageUsuarios({ img }));
          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
        },
        (err) => {
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }
      );
  }
}
