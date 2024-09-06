import { NineSliceSprite, Texture } from "pixi.js";
import { GameObject } from "../GameObject";

export class NineSliceImage extends GameObject<NineSliceSprite> {
    /**
     * 背景纹理
     */
    get texture() {
        return this.display.texture;
    }
    set texture(value: Texture) {
        this.display.texture = value;
    }

    async render() {
        const texture = new Texture();
        this.display = new NineSliceSprite(texture);
    }

    async resize() {
        this.width = this.display.texture.orig.width;
        this.height = this.display.texture.orig.height;
    }
}