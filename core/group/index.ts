import { Container } from "pixi.js";
import { GameObject } from "../GameObject";

export class Group extends GameObject {
    display = new Container();

    protected _width: number = 0;
    protected _height: number = 0;

    get width() {
        return this._width;
    }
    set width(val: number) {
        this._width = val;
        this.refreshPivot();
        this.emitter.emit(GameObject.Event.RESIZE);
    }

    get height() {
        return this._height;
    }
    set height(val: number) {
        this._height = val;
        this.refreshPivot();
        this.emitter.emit(GameObject.Event.RESIZE);
    }

    resize() {
        this.display.getBounds();
        this.width = this.display.width;
        this.height = this.display.height;
    }
}