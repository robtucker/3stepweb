import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from "@angular/material";

import { CoreModule } from "./core";
import { ElementsModule } from "./elements";
import { AppRoutingModule }   from './app-routing.module';

//import { ShowcaseModule } from './pages/showcase';

import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';
import { DevelopmentComponent } from './development/development.component';
import { DataComponent } from './data/data.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
    imports: [ 
        BrowserModule,
        MaterialModule.forRoot(),
        CoreModule,
        ElementsModule,
        AppRoutingModule,
        //ShowcaseModule,
    ],
    declarations: [ 
        AppComponent,
        HomeComponent,
        DesignComponent,
        DevelopmentComponent,
        DataComponent,
        ContactComponent,
        AbortComponent,      
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
