import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BusquedasService } from '../../services/busquedas.service';
import { IUsuario } from '../../models/usuario';
import { IMedico } from '../../models/medico';
import { IHospital } from '../../models/hospital';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public usuarios: IUsuario[] = [];
  public medicos: IMedico[] = [];
  public hospitales: IHospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ termino }) =>
      this.busquedaGlobal(termino)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  busquedaGlobal(termino: string) {
    this.busquedasService
      .busquedaGlobal(termino)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ hospitales, medicos, usuarios }) => {
        this.usuarios = usuarios;
        this.hospitales = hospitales;
        this.medicos = medicos;
      });
  }
}
