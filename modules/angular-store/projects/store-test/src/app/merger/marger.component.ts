import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input, OnDestroy } from '@angular/core';
import { FormDirective, GridDirective } from './anchors';
import { Store } from 'ajwah-angular-store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'marger-com',
  templateUrl: './marger.component.html',
  styleUrls: ['./marger.component.css']
})
export class MergerComponent implements OnInit, OnDestroy {

  @Input('form') formComponentType: any;
  @Input('grid') gridComponentType: any;
  @Input('id') id: string = '';

  @ViewChild(FormDirective) formHost: FormDirective;
  @ViewChild(GridDirective) gridHost: GridDirective;

  sub: Subscription;

  gridCss: any = { 'col-12': true };
  formCss: any = {};

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store) {

  }

  ngOnInit() {
    this.sub = this.store.select('margerState').pipe(filter(it => it.id === this.id)).subscribe(state => {
      this.loadComponent(state.showForm);
    });
    this.loadGridComponent();
  }
  loadComponent(showForm: boolean) {

    if (showForm) {
      this.gridCss = { 'col-6': true, 'col-12': false };
      this.formCss = { 'col-6': true }
      this.loadFormComponent();
    } else {
      this.gridCss = { 'col-6': false, 'col-12': true };
      this.formCss = { 'col-6': false }
      this.clearFormComponent();
    }
  }
  loadFormComponent() {
    if (!this.formComponentType) return;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.formComponentType);

    const viewContainerRef = this.formHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);

  }
  clearFormComponent() {
    this.formHost.viewContainerRef.clear();
  }
  loadGridComponent() {
    if (!this.gridComponentType) return;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.gridComponentType);

    const viewContainerRef = this.gridHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
