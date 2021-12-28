import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { delay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { IHospital } from '../../../models/hospital';
import { CrearHospital } from '../../../interfaces/cargar-hospitales-interface';
import { ModalImagenService } from '../../../components/services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  @ViewChild('txtBusqueda') buscarHospital: ElementRef;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public hospitales: IHospital[] = [];
  public cargando: boolean = true;
  public page = 1;
  public pageSize = 5;
  public totalHospitales: number = 0;
  public desde: number = 0;
  public busqueda: number;

  constructor(
    private hospitalService: HospitalService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
    this.modalImagenService.nuevaImagen
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe(() => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService
      .cargarHospitales(this.desde)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ total, hospitales }) => {
        this.totalHospitales = total;
        this.hospitales = hospitales;
        this.cargando = false;
        this.busqueda = this.hospitales.length;
      });
  }

  guardarCambios(hospital: IHospital) {
    const { _id, nombre } = hospital;
    this.hospitalService
      .actualizarHospital(_id, nombre)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          Swal.fire('Actualizado', nombre, 'success');
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  eliminarHospital(hospital: IHospital) {
    const { _id, nombre } = hospital;
    this.hospitalService
      .borrarHospital(_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          Swal.fire('Borrado', nombre, 'success');
          this.cargarHospitales();
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value).subscribe(
        (resp: CrearHospital) => {
          Swal.fire('Creado', resp.hospital.nombre, 'success');
          this.hospitales.push(resp.hospital);
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }

  abrirModal(hospital: IHospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }

  buscar(termino?: string) {
    if (termino.length === 0) {
      this.page = 1;
      return this.cargarHospitales();
    }

    this.busquedasService
      .buscar('Hospital', termino, this.desde)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.totalHospitales = resp.total;
        this.hospitales = resp.resultados;
        this.busqueda = this.hospitales.length;
        this.cargando = false;
      });
    this.page = 1;
    this.desde = 0;
  }

  cambiarPagina(event) {
    this.desde = (event - 1) * 5;
    this.hospitales.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );

    if (this.buscarHospital.nativeElement.value.length > 0) {
      this.buscar(this.buscarHospital.nativeElement.value);
    } else {
      this.cargarHospitales();
    }
  }
}
