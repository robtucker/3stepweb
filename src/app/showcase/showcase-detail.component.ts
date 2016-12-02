import { Component } from "@angular/core";
import { OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Logger } from "../core";

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
    selector: "showcase-detail",
    templateUrl: './templates/showcase-detail.html',
})
export class ShowcaseComponent implements OnInit {

    /**
     * currently selected showcase
     */
    public selectedShowcase: Showcase;

    constructor(
        log: Logger,
        private showcaseService: ShowcaseService,
        private route: ActivatedRoute
    ) {}

    getSelectedShowcase() { 
        this.route.params.forEach((params: Params) => {
            let id = +params['id']; // (+) converts string 'id' to a number
            this.showcaseService.getById(id).then(showcase => this.selectedShowcase = showcase);
        });
    }

    ngOnInit(): void {
        this.getSelectedShowcase();
    }
}