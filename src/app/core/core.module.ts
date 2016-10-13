import { ModuleWithProviders, NgModule, Optional, SkipSelf, OpaqueToken } from '@angular/core';
import { CommonModule }      from '@angular/common';

import { Log } from "./services/log.service";
import { APP_GLOBALS, AppGlobals } from "./services/globals.service";


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

export class CoreModule {}

export * from "./services/globals.service";
export * from "./services/log.service";