import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { ShowcaseRoutingModule } from "./showcase-routing.module";
import { ShowcaseComponent } from './showcase.component';
import { ShowcaseDetailComponent } from './showcase-detail.component';

import { ShowcaseService } from "./showcase.service";

@NgModule({
    imports: [
        CommonModule,
        ShowcaseRoutingModule
    ],
    declarations: [
        ShowcaseComponent,
        ShowcaseDetailComponent
    ],
    providers: [
        ShowcaseService
    ]

})
export class ShowcaseModule { 

}