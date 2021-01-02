import { CounterService } from '../../services/counter.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <span *ngIf="service.loading$|async">
      loading...
    </span>
  `,
  styleUrls: ['./loading.component.css'],
   changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoadingComponent implements OnInit {

  constructor(public service:CounterService) { }

  ngOnInit(): void {
  }

}
