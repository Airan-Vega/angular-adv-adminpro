import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [],
})
export class IncrementadorComponent implements OnInit {
  @Input('valor') progreso = 50;
  @Input() btnClass = 'btn-primary';
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  cambiarValor(valor: number): number {
    if (this.progreso >= 100 && valor >= 0) {
      this.valorSalida.emit(100);
      return (this.progreso = 100);
    }
    if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      return (this.progreso = 0);
    }
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
  }

  onChange(nuevoValor: number): void {
    if (nuevoValor >= 100) {
      nuevoValor = 100;
    } else if (nuevoValor <= 0) {
      nuevoValor = 0;
    }
    this.valorSalida.emit(nuevoValor);
  }
}
