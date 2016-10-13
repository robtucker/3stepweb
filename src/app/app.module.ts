import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from "./core/core.module";
import { AppRoutingModule }   from './app-routing.module';
import { ShowcaseModule } from './showcase/showcase.module';

import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports:      [ 
        BrowserModule,
        CoreModule,
        AppRoutingModule,
        ShowcaseModule,
    ],
    declarations: [ 
        AppComponent,
        NavbarComponent,
        HomeComponent,
        AbortComponent
      
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
