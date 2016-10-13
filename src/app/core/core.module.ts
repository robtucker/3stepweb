import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Log } from "./services/log.service";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        Log
    ]
})
export class CoreModule {}