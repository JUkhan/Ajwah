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
  @Input('ratio') ratio = '6/6'

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
    if (this.ratio === '12/12') this.loadSingle(showForm);
    const [gcol, fcol] = this.ratio.split('/').map(it => 'col-' + it);

    if (showForm) {
      this.gridCss = { [gcol]: true, 'col-12': false };
      this.formCss = { [fcol]: true }
      this.loadFormComponent();
    } else {
      this.gridCss = { [gcol]: false, 'col-12': true };
      this.formCss = { [fcol]: false }
      this.clearFormComponent();
    }
  }
  loadSingle(showForm: boolean) {
    if (showForm) {
      this.gridCss = { 'col-12': false };
      this.formCss = { 'col-12': true }
      this.clearGridComponent();
      this.loadFormComponent();
    } else {
      this.gridCss = { 'col-12': true };
      this.formCss = { 'col-12': false }
      this.clearFormComponent();
      this.loadGridComponent();
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
  clearGridComponent() {
    this.gridHost.viewContainerRef.clear();
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
