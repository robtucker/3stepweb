import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from "../../core";

@Component({
  selector: 'panel-layout',
  template: `
<div layout="row" layout-xs="column" layout-align="center center"
    [class.panel]="hover" class="padding-y-lg {{color}} {{bgColor}}" style="min-height: 456px;">

  <div layout="column" flex="100" flex-order="0" class="hidden-sm-down">
      <div class="full-width {{imgClass}}"></div>
  </div>

  <div layout="column" layout-align="center center" class="full-width">
      <div layout="column" flex="100" layout-align="center start" class="z-index-10">
        <h2 class="lead marginless">{{title}}</h2>
        <h3 class="margin-y-sm max-width-500">{{description}}</h3>
        <!-- find out more button -->
        <a [routerLink]="link" layout="row" 
            layout-align="center center" 
            class="{{btnBgColor}} {{borderColor}} border-thick padding-x-sm text-decoration-none"
            (mouseenter)="onMouseEnter()"
            (mouseleave)="onMouseLeave()"> 
            <p [class.transparent]="hover" class="padding-x-sm padding-y-sm marginless {{btnColor}}" style="font-size: 20px">Find out more</p>
            <i [class.transparent]="hover" class="material-icons {{btnColor}} arrow-R" style="">arrow_forward</i>
        </a>
      </div>
  </div>
</div>
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
    @Input('showBubbles') showBubbles;

    public borderColor;

    public btnColor;

    public btnBgColor;

    public hover: boolean = false;

    private panelIndex;

    constructor(
        private logger: Logger, 
        private router: Router    
    ) {}

    ngOnInit () {
        this.logger.log(this);

        this.btnColor = this.color
        this.btnBgColor = 'transparent';
        this.borderColor = `border-${ this.color }`;
        // this.panelIndex = `z-index-${this.showBubbles ? 'minus-10 ': '10'}`;
    }

    onMouseEnter(): void {
        this.btnColor = !this.bgColor ? 'primary' : this.bgColor.substr(3);
        //this.btnBgColor = !this.bgColor ? 'transparent' : 'bg-white';
        this.btnBgColor = 'bg-white';
        this.hover = true;
    }

    onMouseLeave(): void {
        this.btnColor = this.color
        this.btnBgColor = 'transparent';
        this.hover = false;
    }
}