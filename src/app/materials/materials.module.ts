/**
 * import selected material design components
 */
import { NgModule, ModuleWithProviders } from '@angular/core';

import { MdButton, MdButtonModule } from "@angular/material";
import { MdToolbarModule } from "@angular/material";

// import { MdButton } from "material2/src/lib/button/button";

@NgModule({

    exports: [
        MdButtonModule,
        MdToolbarModule


    ],
    declarations: [
        // MdButton
    ]
})
export class MaterialsModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MaterialsModule
        };
    }
}
