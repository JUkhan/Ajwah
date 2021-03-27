import { CounterService } from '../../services/counter.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <p>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" (click)="service.increment()">+</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" (click)="service.decrement()">-</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" (click)="service.asyncInc()">async(+)</button>
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
