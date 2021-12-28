import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { MedicoService } from '../../../services/medico.service';
import { IMedico } from '../../../models/medico';
import { ModalImagenService } from '../../../components/services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  @ViewChild('txtBusqueda') buscarMedico: ElementRef;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public medicos: IMedico[] = [];
  public cargando: boolean = true;
  public page = 1;
  public pageSize = 5;
  public totalMedicos: number = 0;
  public desde: number = 0;
  public busqueda: number;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.modalImagenService.nuevaImagen
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe(() => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService
      .cargarMedicos(this.desde)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ total, medicos }) => {
        this.totalMedicos = total;
        this.medicos = medicos;
        this.cargando = false;
        this.busqueda = this.medicos.length;
      });
  }

  borrarMedico(medico: IMedico) {
    const { _id, nombre } = medico;
    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta a punto de borrar a ${nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar medico',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService
          .borrarMedico(_id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            Swal.fire(
              'Medico borrado',
              `${nombre} fue eliminado correctamente`,
              'success'
            );
            this.cargarMedicos();
          });
      }
    });
  }

  abrirModal(medico: IMedico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino?: string) {
    if (termino.length === 0) {
      this.page = 1;
      return this.cargarMedicos();
    }

    this.busquedasService
      .buscar('Medico', termino, this.desde)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.totalMedicos = resp.total;
        this.medicos = resp.resultados;
        this.cargando = false;
        this.busqueda = this.medicos.length;
      });
    this.page = 1;
    this.desde = 0;
  }

  cambiarPagina(event) {
    this.desde = (event - 1) * 5;
    this.medicos.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );

    if (this.buscarMedico.nativeElement.value.length > 0) {
      this.buscar(this.buscarMedico.nativeElement.value);
    } else {
      this.cargarMedicos();
    }
  }
}
