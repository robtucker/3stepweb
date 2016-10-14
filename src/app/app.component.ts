import { Component } from '@angular/core';

import { Logger } from "./core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app',
  template: `
    <navbar></navbar>
    <button md-button color="primary" class="md-button-ripple">App button</button>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { 
    construct(log: Logger) {}
}
