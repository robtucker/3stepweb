import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent }   from './app.component';
import { AbortComponent } from './abort/abort.component';
import { HomeComponent } from './home/home.component';
import { DesignComponent } from './design/design.component';
import { DevelopmentComponent } from './development/development.component';
import { DataComponent } from './data/data.component';
import { ContactComponent } from './contact/contact.component';

const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'design', component: DesignComponent },
    { path: 'development', component: DevelopmentComponent },
    { path: 'data', component: DataComponent },
    { path: 'contact', component: ContactComponent },
    // lazy load the showcases
    //{ path: 'showcase', loadChildren: './showcase/showcase.module#ShowcaseModule' }
    { path: '**', component: AbortComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
