import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[grid-host]',
})
export class GridDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

@Directive({
    selector: '[form-host]',
})
export class FormDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}