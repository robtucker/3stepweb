import { Component, OnInit } from '@angular/core';

import { Logger } from "./core";

import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app',
  template: `

<!-- full screen sidebar layout -->
<md-sidenav-layout fullscreen class="left-navigation">

  <!-- navbar with hamburger -->
  <md-toolbar color="primary">
    <button #hamburger class="hamburger" (click)="fireHamburger(sidenav)">
      <i class="material-icons">menu</i>
    </button>
    {{ brand }}
  </md-toolbar>

  <!-- side bar -->
  <md-sidenav #sidenav id="sidenav" mode="over">
    <span class="logo">3StepWeb</span>
    <md-nav-list>
      <a md-list-item>Test1</a>
      <a md-list-item>Test1</a>
    </md-nav-list>
  </md-sidenav>

  <!-- application -->
  <router-outlet></router-outlet>

  <!-- footer -->
  <footer></footer>

</md-sidenav-layout>
  `
})
export class AppComponent implements OnInit { 

    public displayNav = true;

    public brand = "3StepWeb";

    public pageHeight = "100%";

    constructor(private logger: Logger) {}

    fireHamburger(sidenav) {
      this.logger.debug(this);
      sidenav.toggle();
    }
    
    ngOnInit(): void {
      this.logger.debug(this.logger);
      this.logger.debug(this);
    }


}
