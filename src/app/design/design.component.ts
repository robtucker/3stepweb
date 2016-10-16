import { Component, OnInit } from '@angular/core';

import { Logger } from "../core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'design',
  templateUrl: './design.template.html'
})
export class DesignComponent implements OnInit { 

    public displayNav = true;

    public brand = "3StepWeb";

    public pageHeight = "100%";

    constructor(private logger: Logger) {}

    fireHamburger(sidenav) {
      this.logger.debug(this);
      sidenav.toggle();
    }
    
    ngOnInit(): void {
      this.logger.debug(this.logger);
      this.logger.debug(this);
    }


}
