import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component implements OnInit {
  labels1 = ['Pan', 'Refresco', 'Tacos'];
  data1 = [[10, 15, 40]];
  constructor() {}

  ngOnInit(): void {}
}
