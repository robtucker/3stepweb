import { Injectable } from "@angular/core";

import { AppGlobals } from "./globals.service";

export interface ILog {
    debug(msg);
    info(msg);
    warn(msg);
    error(msg);
    critical(msg);

}

@Injectable()
export class Log implements ILog {

    private LEVELS = {
        DEBUG: 100,
        INFO: 200,
        WARN: 300,
        ERROR: 400,
        CRITICAL: 500
    };

    constructor(private globals: AppGlobals) { }
    
    debug(msg: any) {
        this.log(msg, 'DEBUG');
    }

    info(msg: any) {
        this.log(msg, 'INFO');
    }

    warn(msg: any) {
        this.log(msg, 'WARN');
    }

    error(msg: any) {
        this.log(msg, 'ERROR');
    }

    critical(msg: any) {
        this.log(msg, 'CRITICAL');
    }

    log(msg: any, level ?: string) {
        if(!level || this.globals.LOG_LEVEL >= this.LEVELS[level]) {
            console.log(msg);
        }
    }

}