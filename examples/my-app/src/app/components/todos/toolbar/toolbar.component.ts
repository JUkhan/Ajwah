import { TodosController } from './../controllers/todos-controller';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(public controller: TodosController) { }

  ngOnInit(): void {
  }

}
