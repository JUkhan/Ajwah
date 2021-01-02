import { CounterService } from '../../services/counter.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <p>
      <button class="btn" (click)="service.increment()">+</button>
      <button class="btn" (click)="service.decrement()">-</button>
      <button class="btn" (click)="service.asyncInc()">async(+)</button>
      {{ service.stream$|async}} <app-loading></app-loading>
    </p>
  `,
  styleUrls: ['./counter.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {

  constructor(public service:CounterService) { }

  ngOnInit(): void {
  }

}
