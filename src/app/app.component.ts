import { Component } from '@angular/core';

import { Logger } from "./core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app',
  template: `
    <navbar></navbar>
    <button md-button class="bg-accent-lighter" color="primary">App button</button>
    
    <router-outlet></router-outlet>
  `
})
export class AppComponent { 
    construct(log: Logger) {}
}
