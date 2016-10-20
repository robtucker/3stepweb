import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PanelLayout} from "./layouts/panel-layout.component";
import { NextPage } from "./layouts/next-page.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        PanelLayout,
        NextPage
    ],
    declarations: [
        PanelLayout,
        NextPage
    ]
})
export class ElementsModule { }
