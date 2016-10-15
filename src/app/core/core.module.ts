import { ModuleWithProviders, NgModule, Optional, SkipSelf, OpaqueToken } from '@angular/core';
import { CommonModule }      from '@angular/common';

import { Logger } from "./services/logger.service";
import { APP_GLOBALS, AppConfig } from "./services/app-config.service";

/**
 * Core module
 * https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-module
 */
@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        
    ],
    providers: [
        Logger,
        {provide: "APP_GLOBALS", useValue: APP_GLOBALS},
        AppConfig,
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
