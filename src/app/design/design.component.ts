import { Component, OnInit } from '@angular/core';

import { Logger } from "../core";

@Component({
  selector: 'design',
  templateUrl: './design.template.html'
})
export class DesignComponent implements OnInit { 

    constructor(private logger: Logger) {}
    
    ngOnInit(): void {
      this.logger.debug(this);
    }


}
