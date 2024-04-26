import * as PIXI from 'pixi.js';
import { Group } from './';
export class Application extends PIXI.Application {
    root!: Group;

    public async init(options?: Partial<PIXI.ApplicationOptions>) {
        await super.init(options);

        this.root = new Group();
        this.root.display = this.stage;
    }
}