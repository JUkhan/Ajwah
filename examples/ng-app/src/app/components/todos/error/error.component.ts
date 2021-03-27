import { Observable } from 'rxjs';
import { TodosController } from '../controllers/todos-controller';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  constructor(public service: TodosController) {}

  error$ = this.service.error$;

  ngOnInit(): void {}
}
