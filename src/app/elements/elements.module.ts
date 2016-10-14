/**
 * import selected material design components
 */
import { NgModule, ModuleWithProviders } from '@angular/core';

import { MdButtonModule } from "@angular/material";
import { MdToolbarModule } from "@angular/material";

@NgModule({

    exports: [
        MdButtonModule,
        MdToolbarModule
    ]
})
export class ElementsModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ElementsModule
        };
    }
}
