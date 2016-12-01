import { Component, ViewChildren, OnInit } from '@angular/core';

import { Logger , Utils } from "../../core";

@Component({
  selector: 'carousel',
  template: `
<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner" role="listbox">
    <div class="carousel-item active">
      <h1>sup yo</h1>
      <p>this is a para</p>
    </div>
    <div class="carousel-item">
      <h1>sup yo</h1>
      <p>this is a para</p>
    </div>
    <div class="carousel-item">
      <h1>sup yo</h1>
      <p>this is a para</p>
    </div>
  </div>
  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
    <span class="icon-prev" aria-hidden="true"></span>
  </a>
  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
    <span class="icon-next" aria-hidden="true"></span>
  </a>
</div>
`
})
export class Carousel implements OnInit {

    constructor(
        private logger: Logger, 
        private utils: Utils
    ) {}

    ngOnInit () {

    }
}