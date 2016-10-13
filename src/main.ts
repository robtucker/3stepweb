import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

const platform = platformBrowserDynamic();

platform.bootstrapModule(AppModule);


// should be using precompiled version

// import { platformBrowser } from '@angular/platform-browser';
// import { AppModule } from './app/app.module';

// import { AppModuleNgFactory } from './app.module.ngfactory';

// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);