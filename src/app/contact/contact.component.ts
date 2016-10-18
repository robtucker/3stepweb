import { Component, OnInit } from '@angular/core';

import { Logger } from "../core";

@Component({
  selector: 'contact',
  templateUrl: './contact.template.html'
})
export class ContactComponent implements OnInit { 

    constructor(private logger: Logger) {}

    ngOnInit(): void {
      this.logger.debug(this);
    }


}
