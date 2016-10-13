import { Component } from "@angular/core";
import { OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import * as _ from "lodash";

/**
 * individual showcase
 */
import { Showcase } from "./showcase";

/**
 * showcase data service
 */
import { ShowcaseService } from "./showcase.service";

const ShowcaseTemplate = require('./templates/showcase.html');

/**
 * Showcase component class
 */
@Component({
    selector: "showcase",
    template: ShowcaseTemplate,
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
        private router: Router
    ) {}

    getShowcases() {
        this.showcaseService.index().then((showcases) => {
            this.showcases = showcases;

            console.log(this.route);

            let id = +this.route.params.getValue().id

            this.selectedShowcase = _.find(showcases, {id: id})

        });
    }

    ngOnInit(): void {
        console.log(this);
        this.getShowcases();
    }

    gotoShowcase(showcase: Showcase): void {
        let link = ['/detail', showcase.id];
        this.router.navigate(link);
    }
}