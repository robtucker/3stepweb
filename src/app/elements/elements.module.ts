import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CarouselComponent, SlideComponent } from 'ng2-bootstrap/components/carousel';
import { PanelLayout} from "./layouts/panel-layout.component";
import { NextPage } from "./layouts/next-page.component";
//import { Carousel } from "./layouts/carousel.component";

console.log(CarouselComponent);

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        
    ],
    exports: [
        PanelLayout,
        NextPage,
        CarouselComponent,
        SlideComponent
    ],
    declarations: [
        PanelLayout,
        NextPage,
        CarouselComponent,
        SlideComponent
    ]
})
export class ElementsModule { }
