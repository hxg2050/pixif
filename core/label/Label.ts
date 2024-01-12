import { Text } from "pixi.js";
import { LabelStyle } from "./LabelStyle";
import { Group } from "../group";

export class Label extends Group {
    display = new Text();


    // get width() {
    //     return this._width;
    // }
    // set width() {

    // }

    get value() {
        return this.display.text;
    }
    set value(val: string) {
        this.display.text = val;
    }

    get style() {
        return this.display.style;
    }
    set style(val: LabelStyle) {
        this.display.style = val;
    }

    resize() {
        this.width = this.display.width;
        this.height = this.display.height;
    }
}