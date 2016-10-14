import { Inject, Injectable } from "@angular/core";

/**
 * process.env is populated by webpack DefinePlugin
 */
export const APP_GLOBALS: AppConfigInterface = process.env;

/**
 * interface defining the required properties
 */
export interface AppConfigInterface { 
    LOG_LEVEL: number;
}

/**
 * AppConfig Service
 * 
 * The APP_GLOBALS constant which is passed to the constructor function
 * has already been type cast to implement the AppConfigInterface interface.
 * 
 * So why are we bothering with this class in the first place?
 * 
 * We are explicitly instantiating a separate AppConfig class and copying 
 * the values in the APP_GLOBALS constant over as properties on the class 
 * for 1 reason only: it is much easier to inject a dependency if it is 
 * a classe that has the @Injectable decorator. If you are injecting a hardcoded
 * value as a dependency you must use the additional @Inject("APP_GLOBALS")
 * decorator when you are injecting
 * 
 * Our goal is to make this constructor function the only constructor that 
 * uses the annoying @Inject decorator. All other constructors will simply 
 * inject an instance of this class.
 * 
 */
@Injectable()
export class AppConfig implements AppConfigInterface {

    public LOG_LEVEL;

    constructor(@Inject("APP_GLOBALS") env: AppConfigInterface) {
        this.LOG_LEVEL = env.LOG_LEVEL;
    }

}
