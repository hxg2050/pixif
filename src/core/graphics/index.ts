import { GameObject } from "../GameObject";
import {ColorSource, Graphics as PIXIGraphics} from 'pixi.js'

export class Graphics extends GameObject<PIXIGraphics> {
    public display = new PIXIGraphics();

    async render() {

    }

    public beginFill(color: ColorSource = 0, alpha?: number) {
        this.display.beginFill(color, alpha);
        return this;
    }

    public endFill() {
        this.display.endFill();
        return this;
    }

    public drawRect(x: number, y: number, width: number, height: number) {
        this.display.drawRect(x, y, width, height);
        return this;
    }

    public drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
        this.display.drawRoundedRect(x, y, width, height, radius);
        return this;
    }

    public drawCircle(x: number, y: number, radius: number) {
        this.display.drawCircle(x, y, radius);
        return this;
    }

    public clear() {
        this.display.clear();
        return this;
    }
}