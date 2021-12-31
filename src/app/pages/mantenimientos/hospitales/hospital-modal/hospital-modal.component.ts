import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HospitalService } from '../../../../services/hospital.service';
import { IHospital } from '../../../../models/hospital';

@Component({
  selector: 'app-hospital-modal',
  templateUrl: './hospital-modal.component.html',
  styleUrls: [],
})
export class HospitalModalComponent implements OnInit {
  public hospitales: IHospital[] = [];
  public cargando: boolean = true;
  public page = 1;
  public pageSize = 5;
  public totalHospitales: number = 0;
  public desde: number = 0;
  constructor(
    private modal: NgbActiveModal,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService
      .cargarHospitales(this.desde)
      .subscribe(({ total, hospitales }) => {
        this.totalHospitales = total;
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  cambiarPagina(event) {
    this.desde = (event - 1) * 5;
    this.hospitales.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
    this.cargarHospitales();
  }

  close(hospital) {
    this.modal.close(hospital);
  }
}
