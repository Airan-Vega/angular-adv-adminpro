import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../../pipes/pipes.module';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medico/medico.component';
import { HospitalModalComponent } from './hospitales/hospital-modal/hospital-modal.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    HospitalesComponent,
    MedicosComponent,
    MedicoComponent,
    HospitalModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    PipesModule,
  ],
  exports: [
    UsuariosComponent,
    HospitalesComponent,
    MedicosComponent,
    MedicoComponent,
  ],
})
export class MantenimientosModule {}
