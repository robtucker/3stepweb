import { Component, OnInit } from '@angular/core';

import { Logger } from "./core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app',
  templateUrl: './app.template.html'
})
export class AppComponent implements OnInit { 

    public displayNav = true;

    public appColor: 'primary';

    public brand = ".3Step";

    public pageHeight = "100%";

    constructor(private logger: Logger) {}

    ngOnInit(): void {
      this.logger.debug(this.logger);
      this.logger.debug(this);
    }

    navigate(sidenav, slug, color) {
      sidenav.toggle();
      this.appColor = color;
    }
}
