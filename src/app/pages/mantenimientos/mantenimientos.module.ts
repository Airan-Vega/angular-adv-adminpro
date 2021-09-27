import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsuariosComponent],
  imports: [CommonModule, NgbPaginationModule, FormsModule],
  exports: [UsuariosComponent],
})
export class MantenimientosModule {}
