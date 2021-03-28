import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

// Llamamos una funcion que se encuentra de manera global en la aplicacion
declare function customInitFunctions(): any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    customInitFunctions();
  }
}
