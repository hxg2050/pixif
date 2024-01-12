import { Vector2 } from "@math.gl/core";
import { Component } from "../pixifComponent";
import { GameObject } from "../GameObject";

/**
 * 控制布局
 * 当添加了控制布局组件后，原本的position、size和scale可能会被自动管控手动设置将不会生效
 * ```ts
 * // 创建节点
 * const node = new Transform();
 * // 添加布局组件
 * const layout = node.addComponent(Layout);
 * // 设置铺满整个父节点
 * layout.left = 0;
 * layout.right = 0;
 * layout.top = 0;
 * layout.right = 0;
 * // 放入父节点
 * parent.addChild(node);
 * ```
 */
export class Layout extends Component {
    private oldPosition: Vector2 = new Vector2();
    private oldSize: Vector2 = new Vector2();
    private oldScale: Vector2 = new Vector2();

    private _left?: number;
    /**
     * 相对左边的距离
     */
    get left() {
        return this._left;
    }
    set left(val: number | undefined) {
        this._left = val;
        this._markResize = true;
    }

    private _top?: number;
    /**
     * 相对顶部的距离
     */
    get top() {
        return this._top;
    }
    set top(val: number | undefined) {
        this._top = val;
        this._markResize = true;
    }

    private _right?: number;
    /**
     * 相对右边的距离
     */
    get right() {
        return this._right;
    }
    set right(val: number | undefined) {
        this._right = val;
        this._markResize = true;
    }

    private _bottom?: number;
    /**
     * 相对底部的距离
     */
    get bottom() {
        return this._bottom;
    }
    set bottom(val: number | undefined) {
        this._bottom = val;
        this._markResize = true;
    }

    private _vertical?: number;

    /**
     * 水平剧中
     * left 和 right 将失效
     * 注意：如果要让节点真正实现水平居中需要设置节点的`anchor`
     * ```ts
     * const node = new Transform();
     * node.anchor.x = 0.5;
     * node.addComponent(Layout);
     * ```
     */
    get vertical() {
        return this._vertical;
    }
    set vertical(val: number | undefined) {
        this._vertical = val;
        if (val === undefined) {
            return;
        }
        this._markResize = true;
    }

    private _horizontal?: number;
    /**
     * 垂直居中
     * top 和 bottom 将失效
     * 注意：如果要让节点真正实现垂直居中需要设置节点的`anchor`
     * ```ts
     * const node = new Transform();
     * node.anchor.y = 0.5;
     * node.addComponent(Layout);
     * ```
     */
    get horizontal() {
        return this._horizontal;
    }
    set horizontal(val: number | undefined) {
        this._horizontal = val;
        if (val === undefined) {
            return;
        }
        this._markResize = true;
    }

    awake() {
        // this.node.emitter.on(Transform.Event.INIT_SIZE, this.saveNewSize, this);

        // 当父元素尺寸发生变化时触发
        this.gameObject.parent?.emitter.on(GameObject.Event.RESIZE, this._resize, this);

        // 当自身发生变化时触发
        this.gameObject.emitter.on(GameObject.Event.RESIZE, this._resize, this);

        // 当自身被添加时时添加监听
        this.gameObject.emitter.on(GameObject.Event.ADDED, () => {
            this.gameObject.parent?.emitter.on(GameObject.Event.RESIZE, this._resize, this);
            this._resize();
        }, this);

        // 当自身被移除时移除监听
        this.gameObject.emitter.on(GameObject.Event.REMOVED, (parent: GameObject) => {
            // console.log('REMOVED');
            parent.emitter.off(GameObject.Event.RESIZE, this._resize, this);
        }, this);

        this.saveNewSize();
    }

    _resize() {
        this._markResize = true;
    }

    /**
     * 当挂载节点尺寸发生变化，且需要重新动态计算时调用
     * 将保存当前组件的位置和大小状态
     */
    saveNewSize() {
        this.oldPosition.copy(this.gameObject.transform.position);
        this.oldSize.set(this.gameObject.width, this.gameObject.height);
        this.oldScale.copy(this.gameObject.transform.scale);
        this.resize();
    }

    /**
     * 获取本地偏移
     */
    getOffsetLocation() {
        // const offest = new Vector2(this.gameObject.width, this.gameObject.height);//.multiply(this.gameObject.anchor);
        const offest = new Vector2(this.gameObject.transform.pivotX, this.gameObject.transform.pivotY);
        // offest.subtract([this.gameObject.transform.pivotX, this.gameObject.transform.pivotY]);
        return offest;
    }

    update(): void {
        this._markResize && this.resize();
    }

    _markResize = false;

    /**
     * 重新计算布局/矫正布局
     * ```ts
     * const node = new Transform();
     * const layout = node.addComponent(Layout);
     * node.anchor.set(0.5, 0.5);
     * layout.resize();
     * ```
     */
    /**
     * 矫正布局
     */
    public resize() {
        if (!this.gameObject.parent) {
            return;
        }
        // console.log('this.resize', this.gameObject);
        // console.log('resize');
        this._markResize = false;

        const size = new Vector2(this.gameObject.width, this.gameObject.height);
        const offest = this.getOffsetLocation();

        const { position } = this.gameObject.transform;
        if (this.vertical != undefined) {
            const parent = this.gameObject.parent!;
            const position = this.gameObject.transform.position;

            position.x = (parent.width - this.gameObject.width) / 2 + this.vertical + offest.x;

            this.gameObject.transform.position = position;
        } else {

            if (this.left != undefined) {
                position.x = this.left;
            }

            if (this.right != undefined) {
                const parent = this.gameObject.parent!;
                if (this.left != undefined) {
                    size.x = parent.width - this.left - this.right;
                    // size.x += this.node.getOffset().x;
                } else {
                    size.x = this.oldSize.x;
                    position.x = parent.width - this.right - size.x;
                    position.x += this.getOffsetLocation().x;
                }
            }

        }

        if (this.horizontal != undefined) {
            const parent = this.gameObject.parent!;
            const position = this.gameObject.transform.position;

            position.y = (parent.height - this.gameObject.height) / 2 + this.horizontal + offest.y;

            this.gameObject.transform.position = position;
        } else {
            if (this.top != undefined) {
                position.y = this.top;
            }

            if (this.bottom != undefined) {
                const parent = this.gameObject.parent!;
                if (this.top != undefined) {
                    size.y = parent.height - this.top - this.bottom;
                } else {
                    size.y = this.oldSize.y;
                    position.y = parent.height - this.bottom - size.y;
                    position.y += this.getOffsetLocation().y;
                }
            }
        }

        if (this.left != undefined) {
            position.x += this.getOffsetLocation().x;
        }
        if (this.top != undefined) {
            position.y += this.getOffsetLocation().y;
        }

        // if (!this.gameObject.transform.position.equals(position)) {
        this.gameObject.transform.position = position;
        // }
        if (this.gameObject.width !== size.x) {
            this.gameObject.width = size.x
        }
        if (this.gameObject.height !== size.y) {
            this.gameObject.height = size.y
        }
    }
}