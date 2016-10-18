import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from "../../core";

@Component({
  selector: 'panel-layout',
  template: `
<a [routerLink]="link" layout="layoutClass" layout-xs="column" class="panel text-decoration-none {{color}} {{bgColor}}">
  <div layout="column" flex="100" flex-order="0">
      <div class="full-width" class="{{imgClass}}"></div>
  </div>
  <div layout="column" flex="100" class="padding-x-lg z-stack-10">
      <h2 class="lead">{{title}}</h2>
      <h3>{{description}}</h3>
      <a class=" padding-x-sm padding-y-sm text-decoration-none" [style.border]="borderStyle">
        <span >Find out more</span>
        <i class="material-icons arrow-R">arrow_forward</i>
      </a>
  </div>
</a>
  `
})
export class PanelLayout implements OnInit {

  @Input('title') title;
  @Input('description') description;
  @Input('color') color;
  @Input('bgColor') bgColor;
  @Input('reverse') reverse;
  @Input('link') link;
  @Input('imgClass') imgClass;

  public borderStyle;

  public layoutClass;

  constructor(
    private logger: Logger, 
    private router: Router) {
    this.layoutClass = "row-reverse";
  }

  ngOnInit () {
    this.borderStyle = `3px solid ${ this.color }`;
    this.logger.log(this.borderStyle);
  }

  navigate(): void {
        this.router.navigate(this.link);
    }
}