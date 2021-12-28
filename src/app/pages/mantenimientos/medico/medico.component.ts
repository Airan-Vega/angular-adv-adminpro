import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { HospitalModalComponent } from '../hospitales/hospital-modal/hospital-modal.component';
import { IHospital } from '../../../models/hospital';
import { MedicoService } from '../../../services/medico.service';
import { IMedico } from '../../../models/medico';
import { delay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: [],
})
export class MedicoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public medicoForm: FormGroup;
  public hospitalSeleccionado: IHospital;
  public medicoSeleccionado: IMedico;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private medicoService: MedicoService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activateRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id }) => {
        if (id !== 'nuevo') {
          this.cargarMedico(id);
        }
      });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private cargarMedico(id: string) {
    this.medicoService
      .obtenerMedicoPorId(id)
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe((medico) => {
        if (!medico) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }
        const {
          nombre,
          hospital: { _id },
        } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
        this.hospitalSeleccionado = medico.hospital;
      });
  }

  cargarHospitales() {
    this.modalService.open(HospitalModalComponent).closed.subscribe((data) => {
      this.hospitalSeleccionado = data;
      this.medicoForm.controls.hospital.setValue(this.hospitalSeleccionado._id);
    });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService
        .actualizarMedico(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          Swal.fire(
            'Actualizado',
            `${nombre} actualizado correctamente`,
            'success'
          );
        });
    } else {
      // Crear
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((resp) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }
}
