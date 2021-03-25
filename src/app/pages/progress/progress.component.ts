import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  progreso1 = 25;
  progreso2 = 35;

  get porcentaje1(): string {
    return `${this.progreso1}%`;
  }
  get porcentaje2(): string {
    return `${this.progreso2}%`;
  }

  constructor() {}

  ngOnInit(): void {}
}
