import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { MaterialModule } from '@angular/material';
// import { MdButtonModule } from '@angular/material';
// import { MdButton } from '@angular/material';

import { CoreModule } from "./core";
import { MaterialModule } from "@angular/material";

import { AppRoutingModule }   from './app-routing.module';
import { ShowcaseModule } from './showcase';

import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [ 
        BrowserModule,
        MaterialModule.forRoot(),
        CoreModule,
        AppRoutingModule,
        ShowcaseModule,
    ],
    declarations: [ 
        AppComponent,
        HomeComponent,
        AbortComponent,      
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
