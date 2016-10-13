import { ModuleWithProviders, NgModule, Optional, SkipSelf, OpaqueToken } from '@angular/core';
import { CommonModule }      from '@angular/common';

import { Log } from "./services/log.service";
import { APP_GLOBALS, AppGlobals } from "./services/globals.service";

/**
 * Core module
 * https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-module
 */
@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        Log,
        {provide: "APP_GLOBALS", useValue: APP_GLOBALS},
        AppGlobals,
    ]
})
export class CoreModule {

    /**
     * prevent reimport of core module
     * https://angular.io/docs/ts/latest/guide/ngmodule.html#!#prevent-reimport
     */
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
            'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

}

export * from "./services/globals.service";
export * from "./services/log.service";