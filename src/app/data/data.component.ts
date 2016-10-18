import { Component, OnInit } from '@angular/core';

import { Logger } from "../core";

@Component({
  selector: 'data',
  templateUrl: './data.template.html'
})
export class DataComponent implements OnInit { 

    constructor(private logger: Logger) {}

    ngOnInit(): void {
      this.logger.debug(this);
    }


}
