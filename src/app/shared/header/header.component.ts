import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../models/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  imgUrl: string;
  usuario: IUsuario;
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.imgUrl = this.usuarioService.getImageUsuario();
  }

  logout() {
    this.usuarioService.logout();
  }
}
