import { Component } from "@angular/core";

import { Logger } from "../core";

@Component({
    selector: "home",
    templateUrl: './home.template.html'
})
export class HomeComponent {
    
    constructor(private logger: Logger) {}

}
