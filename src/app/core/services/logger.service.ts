import { Injectable } from "@angular/core";

import { AppConfig } from "./app-config.service";

export interface LoggerInterface {
    debug(msg);
    info(msg);
    warn(msg);
    error(msg);
    critical(msg);

}

@Injectable()
export class Logger implements LoggerInterface {

    private LEVELS = {
        DEBUG: 100,
        INFO: 200,
        WARN: 300,
        ERROR: 400,
        CRITICAL: 500
    };

    constructor(private config: AppConfig) { }
    
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
        if(!level || this.config.LOG_LEVEL >= this.LEVELS[level]) {
            console.log(msg);
        }
    }

}