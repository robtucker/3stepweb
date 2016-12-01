import { Component, ElementRef } from "@angular/core";
import { Logger } from "../core";

@Component({
    selector: "home",
    templateUrl: './home.template.html'
})
export class HomeComponent {
    
    private landingImgHeight;

    constructor(
        private logger: Logger,
        private elementRef: ElementRef) {
        this.logger.debug(this.elementRef);
        this.setLandingImgHeight();
    }

    ngOnInit() {
        
    }

    setLandingImgHeight() {        
       return this.landingImgHeight = (window.innerHeight * 0.6) + 'px';
    }
}
