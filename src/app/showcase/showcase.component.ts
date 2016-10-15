import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AppConfig, Logger } from "../core";

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
        private logger: Logger,
        public config: AppConfig
    ) {}

    getShowcases() {
        this.showcaseService.index().then(showcases => this.showcases = showcases);
    }

    ngOnInit(): void {
        this.logger.debug('Initializing showcase component');
        this.logger.debug(JSON.stringify(this.config));

        this.getShowcases();
    }

    gotoShowcase(showcase: Showcase): void {
        let link = ['/detail', showcase.id];
        this.router.navigate(link);
    }
}