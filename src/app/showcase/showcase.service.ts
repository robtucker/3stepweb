import { Injectable } from "@angular/core";

import * as _ from "lodash";

import { Showcase } from "./showcase";
import { SHOWCASES } from "./showcase.data";
import { find } from "lodash";

@Injectable()
export class ShowcaseService {

    getAll(): Showcase[] {
        return SHOWCASES;
    }
    
    /**
     * Simulate an async call with a promise
     */
    getById(id: number): Showcase {
        return SHOWCASES[id - 1];
    }
    
}