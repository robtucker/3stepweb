import { Showcase } from "./showcase";

export const SHOWCASES: Showcase[] = [
    {
        id: 1,
        title: "FloFunder", 
        client: 'Peerpay',
        location: 'London',
        sector: 'Fintech',
        type: 'Backend and Front End',
        description: `The FloFunder platform allows accountants to contribute to the success of their 
            customers businesses by matching organisations in need of invoice funding with investors.`,
        problem: `Peerpay wanted to build an innovative accountant vetted peer to peer lending platform 
            based on a black box infrastructure and needed a development partner to build the interface 
            and middleware.`,
        solution: `We worked closely with the project management team to develop an agile workflow, 
            build a development team and design the api’s and frontend application. We built an api wrapper 
            to act as a pass through to their proprietary blackbox backend and we developed business logic 
            and data storage to meet the project spec. We then built the frontend application interface.`,
        stack: ['AngularJS', 'Oracle', 'Mysql', 'Redis', 'Lumen'],
        imgClass1: 'img-flofunder1',
        imgClass2: "img-flofunder2",
    },
    {
        id: 2,
        title: "DrinkZ", 
        client: 'Mashed Apps',
        location: 'Stockholm',
        sector: 'Hospitality',
        type: 'Backend Infrastructure',
        description: `DrinkZ a novel mobile app which allows people to pre-order drinks to skip the queue 
            at the bar or to buy their friends a drink from anywhere in the world.`,
        problem: `The DrinkZ team had app developers on board for the project but they needed a 
            backend infrastructure team to help develop the data API, permissions system, caching and to 
            provision & deployment web-servers.`,
        solution: `We started with with the application wireframes and designed the database ERD 
            and API entity model. We created a multi role permission system to accommodate the apps views 
            and use cases. We then built a lightweight and flexible REST Api using Laravel Lumen & Mysql 
            so that data could be stored and retrieved by the app. We optimized performance using Redis 
            object caching and developed a system for grouping api requests to minimize the number of 
            calls required`,
        stack: ['Lumen', 'php', 'Mysql', 'Redis'],
        imgClass1: 'img-drinks',
        iframe: "https://player.vimeo.com/video/165132597?title=0&byline=0&portrait=0",
    },
    {
        id: 3,
        title: "ReadWave", 
        client: 'Circalit',
        location: 'London',
        sector: 'Hospitality',
        type: 'Full Product',
        description: `ReadWave is a writing community which allows users to share 3 minute stories, 
            enter writing competitions and discuss their stories.`,
        problem: `The Readwave team wanted to build an innovative digital publishing platform for 
            user generated content. The model was based around users sharing content on social 
            platforms which was expected to generate bursts of traffic and as a result the platform 
            needed to be optimised for volume and robust.`,
        solution: `We designed a seamless writing tool to allow users to write and customise their 
            stories with artwork and formatting whilst measuring the read time to keep content under 
            the 3 minute soft constraint of the platform. We engineered a decoupled infrastructure 
            to allow for horizontal scaling with multiple web heads and a centralised database 
            wrapped in a REST api with a caching layer. The final platform was robust and tolerant 
            to support many concurrent users.`,
        stack: ['Silex', 'php', 'Mysql', 'Redis'],
        imgClass1: 'img-readwave1',
        imgClass2: 'img-readwave2',
    },
    {
        id: 4,
        title: "VEEA", 
        client: 'Mashed Apps',
        location: 'Stockholm',
        sector: 'Hospitality',
        type: 'Backend Infrastructure',
        description: `ReadWave is a writing community which allows users to share 3 minute stories, 
            enter writing competitions and discuss their stories.`,
        problem: `After the successful launch of Drinkz, we were asked to develop the backend 
            solution for the VEEA MVP app.`,
        solution: `Using the core REST api software from the DrinkZ project, we built a new 
            database schema and entity relationship model. We implemented new use cases to 
            meet the app requirements and deployed our code for the app development team 
            to build against.`,
        stack: ['Lumen', 'php', 'Mysql', 'Redis'],
        imgClass1: 'img-veea1',
        imgClass2: 'img-veea2',
    }
];
