import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { MaterialModule } from '@angular/material';
// import { MdButtonModule } from '@angular/material';
// import { MdButton } from '@angular/material';

import { CoreModule } from "./core";
import { MaterialsModule } from "./materials";

import { AppRoutingModule }   from './app-routing.module';
import { ShowcaseModule } from './showcase';

import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [ 
        BrowserModule,
        MaterialsModule,
        CoreModule,
        AppRoutingModule,
        ShowcaseModule,
    ],
    declarations: [ 
        AppComponent,
        NavbarComponent,
        HomeComponent,
        AbortComponent,      
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
