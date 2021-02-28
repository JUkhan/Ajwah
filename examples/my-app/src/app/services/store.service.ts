import { AjwahStore } from 'ajwah-store';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService extends AjwahStore{

  constructor() { 
    super()
  }
}
