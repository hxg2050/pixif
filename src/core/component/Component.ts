import { GameObject } from "../GameObject";

export abstract class Component<T extends GameObject = GameObject> {
    constructor(public gameObject: T) {
        gameObject.display.on('destroyed', this.destroy, this)
    }

    awake?() {

    }

    start?() {

    }

    update?(dt: number) {

    }

    /**
     * 销毁组件
     */
    destroy() {
        this.gameObject.removeComponent(this);
        this.update && this.gameObject.emitter.off(GameObject.Event.TICKER_BEFORE, this.update, this);
    }

    onDestroy?() {

    }
}
