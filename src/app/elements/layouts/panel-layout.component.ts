import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from "../../core";

@Component({
  selector: 'panel-layout',
   host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  },
  template: `
<a [routerLink]="link" 
    layout="row" 
    layout-xs="column" 
    class="panel padding-y-lg text-decoration-none {{color}} {{bgColor}}">

  <div layout="column" flex="100" flex-order="0">
      <div class="full-width" class="{{imgClass}}"></div>
  </div>

  <div layout="column" flex="100" layout-align="center start" class="padding-x-lg z-stack-10">
      <h2 class="lead marginless">{{title}}</h2>
      <h3>{{description}}</h3>
      <div layout="row" 
          layout-align="center center" 
          class="{{btnBgColor}} {{borderColor}} border-thick padding-x-sm"> 
        <p [class.transparent]="hover" class="padding-x-sm {{btnColor}}" style="font-size: 20px">Find out more</p>
        <i [class.transparent]="hover" class="material-icons {{btnColor}} arrow-R" style="">arrow_forward</i>
      </div>
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

    public borderColor;

    public btnColor;

    public btnBgColor;

    public hover = false;

    constructor(
        private logger: Logger, 
        private router: Router    
    ) {}

    ngOnInit () {
        this.logger.log(this);

        this.btnColor = this.color
        this.btnBgColor = 'transparent';
        this.borderColor = `border-${ this.color }`;
    }

    onMouseEnter(): void {
        this.btnColor = !this.bgColor ? 'primary' : this.bgColor.substr(3);
        this.btnBgColor = !this.bgColor ? 'transparent' : 'bg-white';
        this.hover = true;
    }

    onMouseLeave(): void {
        this.btnColor = this.color
        this.btnBgColor = 'transparent';
        this.hover = false;
    }
}