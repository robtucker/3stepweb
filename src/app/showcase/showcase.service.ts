import { Injectable } from "@angular/core";

import * as _ from "lodash";

import { Showcase } from "./showcase";
import { SHOWCASES } from "./showcase.mock";

@Injectable()
export class ShowcaseService {
    /**
     * Simulate an async call with a promise
     */
    index(): Promise<Showcase[]> {
        return Promise.resolve(SHOWCASES);
    }

    getById(id: number): Promise<Showcase> {
        return Promise.resolve(_.find(SHOWCASES, {id: id}));
    }
}