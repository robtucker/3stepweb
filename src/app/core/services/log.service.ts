export interface Log {
    
    debug(msg);
    info(msg);
    warn(msg);
    error(msg);
    critical(msg);

}

export class Log {

    private LEVELS = {
        DEBUG: 100,
        INFO: 200,
        WARN: 300,
        ERROR: 400,
        CRITICAL: 500
    };

    constructor() {
        console.log('logging app config');
        console.log(process.env);
    }
    
    debug(msg) {
        log('DEBUG', msg);
    }

    info(msg) {
        log('DEBUG', msg);
    }

    warn(msg) {
        log('DEBUG', msg);
    }

    error(msg) {
        log('DEBUG', msg);
    }

    critical(msg) {
        log('DEBUG', msg);
    }

    log(type, msg) {
        if(process.env.LOG_LEVEL > this.LEVELS[type]) {
            console.log(msg);
        }
    }

}