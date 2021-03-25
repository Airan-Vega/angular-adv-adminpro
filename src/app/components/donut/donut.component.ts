import { Component, Input, OnInit } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [],
})
export class DonutComponent implements OnInit {
  @Input() title = 'Sin titulo';

  @Input('labels') doughnutChartLabels: Label[] = [
    'Label 1',
    'Label 2',
    'Label 3',
  ];
  @Input('data') doughnutChartData: MultiDataSet = [[350, 450, 100]];
  colors: Color[] = [{ backgroundColor: ['#6857E6', '#009FEE', '#F02059'] }];
  constructor() {}

  ngOnInit(): void {}
}
