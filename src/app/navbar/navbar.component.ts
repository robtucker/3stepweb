import { Component } from "@angular/core";

var NavbarTemplate = require("./templates/navbar.html");

@Component({
    selector: "navbar",
    template: NavbarTemplate
})
export class NavbarComponent { 

    public displayNav = true;

}