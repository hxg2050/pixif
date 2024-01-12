import * as PIXI from 'pixi.js';
import { Group } from './';
export class Application<VIEW extends PIXI.ICanvas = PIXI.ICanvas> extends PIXI.Application<VIEW> {

    root: Group;

    constructor(options?: Partial<PIXI.IApplicationOptions>) {
        super(options);
        this.root = new Group();
        this.root.display = this.stage;
    }
}