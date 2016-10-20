import { Component, OnInit, ElementRef } from '@angular/core';

import { Logger } from "../core";

@Component({
    selector: 'design',
    templateUrl: './design.template.html'
})
export class DesignComponent implements OnInit { 

    private playerHeight;

    constructor(
        private logger: Logger,
        private elementRef: ElementRef
    ) {}
    
    ngOnInit(): void {
        this.logger.debug(this);
        this.setIframeHeight();
    }

    setIframeHeight() {
        this.playerHeight = `${ window.innerWidth * 0.5 }px` ;
    }

    onResize(event) {
        this.logger.debug('resize event received');
        this.setIframeHeight();
    }

}
