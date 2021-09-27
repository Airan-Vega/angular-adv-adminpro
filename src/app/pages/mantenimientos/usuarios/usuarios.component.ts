import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IUsuario } from '../../../models/usuario';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../components/services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  @ViewChild('txtBusqueda') buscarUsuario: ElementRef;
  page = 1;
  pageSize = 5;
  public totalUsuarios: number = 0;
  public usuarios: IUsuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.modalImagenService.nuevaImagen
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe(() => this.cargarUsuarios());
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;

        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  buscar(termino?: string) {
    if (termino.length === 0) {
      this.page = 1;
      return this.cargarUsuarios();
    }

    this.busquedasService
      .buscar('Usuario', termino, this.desde)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.totalUsuarios = resp.total;
        this.usuarios = resp.resultados;
        this.cargando = false;
      });
    this.page = 1;
    this.desde = 0;
  }

  cambiarPagina(event) {
    this.desde = (event - 1) * 5;
    this.usuarios.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
    if (this.buscarUsuario.nativeElement.value.length > 0) {
      this.buscar(this.buscarUsuario.nativeElement.value);
    } else {
      this.cargarUsuarios();
    }
  }

  eliminarUsuario(usuario: IUsuario) {
    if (usuario._id === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar usuario',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService
          .eliminarUsuario(usuario._id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
            this.cargarUsuarios();
          });
      }
    });
  }

  cambiarRole(usuario: IUsuario) {
    this.usuarioService
      .actualizarUsuario(usuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  abrirModal(usuario: IUsuario) {
    this.modalImagenService.abrirModal('usuarios', usuario._id, usuario.img);
  }
}
