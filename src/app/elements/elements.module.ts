//modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

//pipes
import { SafePipe } from "./pipes/safe.pipe";

//components
import { CarouselComponent, SlideComponent } from 'ng2-bootstrap/components/carousel';
import { PanelLayout} from "./layouts/panel-layout.component";
import { NextPage } from "./layouts/next-page.component";

console.log(CarouselComponent);

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        
    ],
    exports: [
        SafePipe,
        PanelLayout,
        NextPage,
        CarouselComponent,
        SlideComponent
    ],
    declarations: [
        SafePipe,
        PanelLayout,
        NextPage,
        CarouselComponent,
        SlideComponent
    ]
})
export class ElementsModule { }
