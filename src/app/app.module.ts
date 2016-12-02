import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from "@angular/material";

//modules
import { CoreModule } from "./core";
import { ElementsModule } from "./elements";
import { AppRoutingModule }   from './app-routing.module';

// services
import { ShowcaseService } from "./showcase/showcase.service";

// components
import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';
import { DevelopmentComponent } from './development/development.component';
import { DataComponent } from './data/data.component';
import { ContactComponent } from './contact/contact.component';
import { ShowcaseComponent } from './showcase/showcase.component';

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
        ShowcaseComponent  
    ],
    providers: [
        ShowcaseService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
