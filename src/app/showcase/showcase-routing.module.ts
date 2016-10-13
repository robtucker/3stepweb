import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShowcaseComponent } from './showcase.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'showcase/:id', component: ShowcaseComponent },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ShowcaseRoutingModule {}