import { Component } from '@angular/core';

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app',
  template: `
    <navbar></navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { 

}