import { Component } from '@angular/core';

import { Logger } from "./core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app',
  template: `
    <navbar></navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { 
    construct(log: Logger) {}

}