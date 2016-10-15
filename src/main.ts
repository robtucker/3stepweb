/**
 * stylesheets
 */
import "./sass/app.scss";

/**
 * browser specific modules
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

/**
 * top level app module
 */
import { AppModule } from './app/app.module';

/**
 * compile modules for this platform
 */
const platform = platformBrowserDynamic();

/**
 * load the application
 */
platform.bootstrapModule(AppModule);


// TODO (Rob) should be using AoT compiling

// import { platformBrowser } from '@angular/platform-browser';
// import { AppModuleNgFactory } from './app.module.ngfactory';
// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);