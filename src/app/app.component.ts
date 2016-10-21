import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Logger, Utils, AppConfig} from "./core";

import { Router, ActivatedRoute, Route, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app',
  templateUrl: './app.template.html'
})
export class AppComponent implements OnInit { 

    @ViewChild('sidenav') sidenav;

    /**
     * Currently selected route endpoint
     */
    private currentRoute: NavigationEnd;

    /**
     * Label of the current route
     */
    public currentRouteLabel: string;

    /**
     * Display the navigation bar
     */
    public displayNav: boolean = true;

    /**
     * Currently selected theme
     */
    public appTheme: string = 'main-theme';

    private contactEmail: string;

    private contactPhone: string;

    /**
     * Navbar brand text
     */
    public brand: string = ".3Step";

    /**
     * Assign each page a color palette
     */
    private themes = {
        home: 'main-theme',
        design: 'indigo-theme',
        development: 'green-theme',
        data: 'pink-theme',
        contact: 'main-theme'
    };

    /**
     * Component constructor
     */
    constructor(
      private logger: Logger,
      private config: AppConfig,
      private router: Router,
      private utils: Utils,
      private element: ElementRef
    ) {
         router.events.filter(event => event instanceof NavigationEnd).subscribe((val: NavigationEnd) => {
            this.currentRoute = val;

            //element.nativeElement.scrollIntoView();

            this.setAppTheme(val);
            
            this.logger.debug('scrolling to window top');
            this.logger.debug(element);
            window.scrollTo(0, 0);

        });
      }

    /**
     * Component initialization lifecycle callback
     */
    ngOnInit(): void {
      this.logger.debug(this.currentRoute);
      this.logger.debug(this);

      this.contactEmail = this.config.CONTACT_EMAIL;
      this.contactPhone = this.config.CONTACT_PHONE;
    }

    /**
     * Toggle the side drawer
     */
    toggleSidenav() {
      this.sidenav.toggle();
    }

    /**
     *  Set the application's theme based on the route
     */
    setAppTheme(route: NavigationEnd) {
        // get the current route name
        let explode = route.url.split('/');
        // default to the home theme
        let slug = explode[0] || explode[1] || 'home'; 

        this.logger.debug(`route change detected: ${slug}`);

        this.currentRouteLabel = slug === 'home' ? '' : `${this.utils.ucfirst(slug)}`;
        
        return this.appTheme = this.themes[slug] || 'default'
    }

}
