import { Component } from "@angular/core";

import { Logger } from "../core";
    
@Component({
    selector: "navbar",
    templateUrl: "./templates/navbar.html"
})
export class NavbarComponent { 

    public displayNav = true;

    construct(log: Logger) {}

}