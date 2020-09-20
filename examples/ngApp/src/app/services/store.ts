import { Injectable } from '@angular/core';
import { AjwahStore } from 'ajwah-store';
@Injectable()
export class Store<S = any> extends AjwahStore {
  constructor() {
    super();
  }
  sdf() {}
}
