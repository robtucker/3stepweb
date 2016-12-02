export interface ShowcaseInterface {}

export class Showcase {
    
    public id: number;
    public title: string;
    public client: string;
    public location: string;
    public sector: string;
    public type: string;
    public description: string;
    public problem: string;
    public solution: string;
    public stack: string[];
    public imgClass1: string;
    public imgClass2?: string;
    public iframe?: string;
}
