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
    templateUrl: './showcase.template.html',
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
    public s: Showcase;

    constructor(
        private showcaseService: ShowcaseService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router,
        private logger: Logger,
        public config: AppConfig
    ) {}

    ngOnInit(): void {
        this.showcases = this.showcaseService.getAll();;
        this.getSelectedShowcase();
        this.logger.debug('Initializing showcase component');
        this.logger.debug(this);
    }

    getSelectedShowcase() { 
        this.route.params.forEach((params: Params) => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.s = this.showcaseService.getById(id);
        });
    }

    routeActive(id: number): boolean {
        let res = this.s.id === id;
        console.log('checing if route is active: ' + res);
        return res;
    }
}