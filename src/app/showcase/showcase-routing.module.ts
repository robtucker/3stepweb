import { NgModule }     from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowcaseComponent } from './showcase.component';

// routes specific to the showcase feature area
const ROUTES: Routes = [
    { path: ':id', component: ShowcaseComponent }

];

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: ROUTES,
                component: ShowcaseComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ShowcaseRoutingModule {}