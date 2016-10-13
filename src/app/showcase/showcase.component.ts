import { Component, Inject } from "@angular/core";
import { OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AppGlobals, Log } from "../core";

/**
 * individual showcase
 */
import { Showcase } from "./showcase";

/**
 * showcase data service
 */
import { ShowcaseService } from "./showcase.service";


/**
 * Showcase component class
 */
@Component({
    selector: "showcase",
    template: '<router-outlet></router-outlet>',
    //providers: [ShowcaseService]
})
export class ShowcaseComponent implements OnInit {

    /**
     * array of showcases
     */
    public showcases: Showcase[];

    /**
     * currently selected showcase
     */
    public selectedShowcase: Showcase;

    constructor(
        private showcaseService: ShowcaseService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router,
        private log: Log,
        public globals: AppGlobals
    ) {}

    getShowcases() {
        this.showcaseService.index().then(showcases => this.showcases = showcases);
    }

    ngOnInit(): void {
        this.log.debug('Initializing showcase component');
        this.log.debug(JSON.stringify(this.globals));

        this.getShowcases();
    }

    gotoShowcase(showcase: Showcase): void {
        let link = ['/detail', showcase.id];
        this.router.navigate(link);
    }
}