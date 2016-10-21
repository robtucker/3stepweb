import { Component, OnInit } from '@angular/core';

import { Logger, AppConfig } from "../core";

@Component({
  selector: 'contact',
  templateUrl: './contact.template.html'
})
export class ContactComponent implements OnInit { 

    public contactEmail: string;

    constructor(
      private logger: Logger,
      private config: AppConfig
    ) {}

    ngOnInit(): void {
      this.logger.debug(this);

      this.contactEmail = this.config.CONTACT_EMAIL;
    }



}
