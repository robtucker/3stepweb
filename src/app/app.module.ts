import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule }   from './app-routing.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { ShowcaseRoutingModule } from './showcase/showcase-routing.module';

import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports:      [ 
        BrowserModule,
        RouterModule,
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
export class AppModule { 
    constructor(showcaseModule: ShowcaseModule) {
        console.log(ShowcaseModule);
    }
}
