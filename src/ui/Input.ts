import { StrokeStyle, Ticker } from "pixi.js";
import { GameObject, Graphics, Group, Label, LabelStyle } from "../core";

export class Input extends Group {

    public graphics!: Graphics;
    public element!: HTMLTextAreaElement;
    public value!: Label;

    set width(val: number) {
        super.width = val;
        this.resize();
    }
    get width() {
        return super.width;
    }

    set height(val: number) {
        super.height = val;
        this.resize();
    }
    get height() {
        return super.height
    }

    set x(val: number) {
        super.x = val;
        this.updateTransform();
    }
    get x() {
        return super.x;
    }

    set y(val: number) {
        super.y = val;
        this.updateTransform();
    }
    get y() {
        return super.y
    }

    set scaleX(val: number) {
        super.scaleX = val;
        this.updateTransform();
    }
    get scaleX() {
        return super.scaleX
    }

    set scaleY(val: number) {
        super.scaleY = val;
        this.updateTransform();
    }
    get scaleY() {
        return super.scaleY
    }

    private _isUpdateTransform = false;
    updateTransform() {
        this._isUpdateTransform = true;
    }

    private _isResize = false;
    resize(): void {
        this._isResize = true;
        this._isDrawStyle = true;
    }

    public async render() {
        this.element = document.createElement('textarea')
        this.element.className = 'textarea'
        this.element.style.display = 'none';
        this.element.onfocus = this.onFocus.bind(this);
        this.element.onblur = this.onBlur.bind(this);
        window.document.body.append(this.element);
        this.graphics = await GameObject.instantiate(Graphics, this)
        this.value = await GameObject.instantiate(Label, this, {
            style: this._labelStyle
        })


        this.graphics.display.eventMode = 'static';
        this.graphics.display.on('pointerdown', this.focus, this)
    }

    public update(dt: number): void {
        if (this._isUpdateTransform) {
            this._isUpdateTransform = false;
            const { a, b, c, d, tx, ty } = this.display.worldTransform;
            this.element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`
            this.element.style.transformOrigin = `${this.anchorX}% ${this.anchorY}%`;
        }
        if (this._isResize) {
            this._isResize = false;
            this.element.style.width = this.width + 'px'
            this.element.style.height = this.height + 'px'
        }
        if (this._isDrawStyle) {
            this.drawStyle();
        }
    }

    private _stokeStyle: StrokeStyle = { width: 1, color: 0x828282 }

    private _backgroundColor = 0xffffff;
    set backgroundColor(val: number) {
        this._backgroundColor = val
        this._isDrawStyle = true;
    }

    set borderColor(val: number) {
        this._stokeStyle.color = val;
        this._isDrawStyle = true;
    }

    set borderSize(val: number) {
        this._stokeStyle.width = val;
        this._isDrawStyle = true;
    }

    private _labelStyle = new LabelStyle({
        fontSize: 16
    })
    set fontSize(val: number) {
        this._labelStyle.fontSize = val;
    }
    get fontSize() {
        return this._labelStyle.fontSize;
    }

    private _isDrawStyle = false;
    public drawStyle() {
        this.graphics.clear();
        this.graphics.rect(0, 0, this.width, this.height);
        this.graphics.fill(this._backgroundColor)
        this.graphics.stroke(this._stokeStyle);
    }

    private onFocus() {
        console.log('focus');
        this.value.display.visible = false
        this.borderColor = 0x0000ff;
        this.borderSize = 2
    }
    public focus() {
        console.log('f');
        this.element.style.display = 'block';
        Ticker.shared.addOnce(() => {
            this.element.focus()
        })
    }

    private onBlur() {
        console.log('blur');
        this.borderColor = 0x828282;
        this.borderSize = 1
        this.element.style.display = 'none';
        this.value.value = this.element.value;
        this.value.display.visible = true
    }
    public blur() {
        this.element.blur()
    }
}