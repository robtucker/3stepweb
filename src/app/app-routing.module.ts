import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbortComponent } from './abort/abort.component';
import { HomeComponent } from './home/home.component';

const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    // lazy load the showcases
    { path: 'showcase', loadChildren: './showcase/showcase.module#ShowcaseModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
