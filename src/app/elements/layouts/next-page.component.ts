import { Component, Input, OnInit } from '@angular/core';

import { Logger , Utils } from "../../core";

@Component({
  selector: 'next-page',
  template: `
    <a routerLink="/{{nextPage}}" layout="row" layout-align="end center" 
    class="panel bg-primary white padding-x-md padding-y-md text-decoration-none"> 
        <div class="padding-x-sm z-index-10">
            <span class="grey-light">Next</span>
            <h2 class="marginless">{{title}}</h2>
        </div>
        <i [class.transparent]="hover" class="material-icons arrow-R" style="">arrow_forward</i>
    </a>
`
})
export class NextPage implements OnInit {

    @Input('nextPage') nextPage;
    @Input('label') label;

    private title: string;

    constructor(
        private logger: Logger, 
        private utils: Utils
    ) {}

    ngOnInit () {
        this.logger.log(this);

        this.title = this.label || this.utils.ucfirst(this.nextPage);
    }
}