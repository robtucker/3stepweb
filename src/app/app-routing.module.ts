import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbortComponent } from './abort/abort.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'home', component: HomeComponent },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}