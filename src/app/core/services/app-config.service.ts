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
    CONTACT_EMAIL: string,
    CONTACT_PHONE: string
}

/**
 * AppConfig Service
 * 
 * The APP_GLOBALS constant which is passed to the constructor function
 * has already been added to the module and is available throoughout the app.
 * 
 * So why are we bothering with this class in the first place?
 * 
 * We are explicitly instantiating a separate AppConfig class and copying 
 * the values in the APP_GLOBALS constant over as properties on the class 
 * for 1 reason only: it is much easier to inject a dependency if it is 
 * a class that has the @Injectable decorator. If you are injecting a hardcoded
 * value as a dependency you must use the additional @Inject("APP_GLOBALS")
 * decorator when you are injecting (see the constructor function below)
 * 
 * Our goal is to make this constructor function the only constructor that 
 * uses the annoying @Inject decorator. All other constructors will simply 
 * inject an instance of this wrapper class.
 * 
 */
@Injectable()
export class AppConfig implements AppConfigInterface {

    public LOG_LEVEL;
    public CONTACT_EMAIL;
    public CONTACT_PHONE;

    constructor(@Inject("APP_GLOBALS") env: AppConfigInterface) {
        this.LOG_LEVEL = env.LOG_LEVEL;
        this.CONTACT_EMAIL = env.CONTACT_EMAIL;        
        this.CONTACT_PHONE = env.CONTACT_PHONE;
    }

}
