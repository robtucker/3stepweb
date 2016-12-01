import { Component, OnInit } from '@angular/core';

import { Logger } from "../core";

@Component({
  selector: 'development',
  templateUrl: './development.template.html'
})
export class DevelopmentComponent implements OnInit { 

    constructor(private logger: Logger) {}
    
    ngOnInit(): void {
      this.logger.debug(this);
                  
      // this.logger.debug('scrolling to window top');
      // this.logger.debug(element);
      window.scrollTo(0, 0);
    }


}
