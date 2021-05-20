import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../models/usuario';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  imgUrl: string;
  name: string;
  public usuario: IUsuario;

  constructor(
    private sidebarService: SidebarService,
    private usuarioService: UsuarioService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.menuItems = this.sidebarService.menu;
    this.imgUrl = this.usuarioService.getImageUsuario();
  }
}
