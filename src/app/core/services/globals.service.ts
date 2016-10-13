import { Inject, Injectable } from "@angular/core";

/**
 * process.env is populated by webpack DefinePlugin
 */
export const APP_GLOBALS: IAppGlobals = process.env;

/**
 * interface defining the required properties
 */
export interface IAppGlobals { 
    LOG_LEVEL: number;
}

/**
 * AppGlobals Service
 * 
 * The APP_GLOBALS constant being passed to the constructor function
 * has already been type cast to implement the IAppGlobals interface.
 * 
 * So why are we bothering with this class in the first place?
 * 
 * We are explicitly instantiating the class and copying all the values in 
 * the APP_GLOBALS constant over as properties on the class for 1 reason only:
 * it is much easier to pass injectable classes around the application
 * than it is to pass values. 
 * 
 * Our goal is to make this constructor function the only constructor that 
 * uses the annoying @Inject decorator. All other constructors will simply 
 * inject an instance of this class.
 * 
 */
@Injectable()
export class AppGlobals implements IAppGlobals {

    public LOG_LEVEL;

    constructor(@Inject("APP_GLOBALS") env: IAppGlobals) {
        this.LOG_LEVEL = env.LOG_LEVEL;
    }

}
