import { GameObject, Group } from "../core";

export class Input extends Group {

    public element!: HTMLTextAreaElement;

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
        //  `translate(${this.x}px, ${this.y}px) scale(${this.scaleX}, ${this.scaleY}) rotate(${this.rotation}deg)`
        // console.log(this.display.worldTransform, this.display.localTransform, this.display.groupTransform, this.display)
    }

    private _isResize = false;
    resize(): void {
        this._isResize = true;
        // this.element.style.width = this.width + 'px'
        // this.element.style.height = this.height + 'px'
        // console.log(this.width, this.height);
    }

    public async render() {
        this.element = document.createElement('textarea')
        this.element.className = 'textarea'
        window.document.body.append(this.element);
    }

    public update(dt: number): void {
        if (this._isUpdateTransform) {
            this._isUpdateTransform = false;
            const {a, b, c, d, tx, ty} = this.display.worldTransform;
            this.element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`
            this.element.style.transformOrigin = `${this.anchorX}% ${this.anchorY}%`;
        }
        if (this._isResize) {
            this._isResize = false;
            this.element.style.width = this.width + 'px'
            this.element.style.height = this.height + 'px'
        }
    }
}