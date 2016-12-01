import { Component, OnInit, ElementRef } from '@angular/core';

import { Logger } from "../core";

@Component({
    selector: 'design',
    templateUrl: './design.template.html'
})
export class DesignComponent implements OnInit { 

    /**
     * the height is a string containing the px sffix
     */
    private playerHeight: string;

    /**
     * Url to the project's repo
     */
    private repoUrl: string = "https://github.com/robtucker/3stepweb";

    constructor(
        private logger: Logger,
        private elementRef: ElementRef
    ) {}
    
    ngOnInit(): void {
        this.logger.debug(this);
        this.setIframeHeight();
        window.scrollTo(0, 0);
    }

    setIframeHeight() {
        this.playerHeight = `${ window.innerWidth * 0.5 }px` ;
    }

    onResize(event) {
        this.logger.debug('resize event received');
        this.setIframeHeight();
    }

}
