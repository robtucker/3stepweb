import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PanelLayout} from "./layouts/panel-layout.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        PanelLayout
    ],
    declarations: [
        PanelLayout
    ]
})
export class ElementsModule { }
