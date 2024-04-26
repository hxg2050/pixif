import { GameObject, Component } from "pixif";

export class GridLayout extends Component {

    row = 1;
    gridWidth = 1;
    gridHeight = 1;

    gapVertical = 0;
    gapHorizontal = 0;

    private _refresh = true

    awake(): void {
        this.gameObject.emitter.on(GameObject.Event.CHILD_ADDED, () => {
            console.log('GameObject.Event.CHILD_ADDED');
            this._resize();
        }, this)
        this.gameObject.emitter.on(GameObject.Event.CHILD_REMOVED, () => {
            console.log('GameObject.Event.CHILD_REMOVED');
            this._resize();
        }, this)
    }

    _resize() {
        this._refresh = true;
    }

    /**
     * 计算布局
     */
    resize() {
        const children = this.gameObject.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.width = this.gridWidth;
            child.height = this.gridHeight;

            const row = i % this.row;
            const col = Math.floor(i / this.row);

            // const gv = row === 0 ? 0 : this.gapVertical;
            // const gh = col === 0 ? 0 : this.gapHorizontal;

            child.transform.x = row * (this.gridWidth + this.gapVertical);
            child.transform.y = col * (this.gridHeight + this.gapHorizontal);
        }
        // if (this.gameObject.parent) {
        //     (this.gameObject.parent as Group).resize();
        //     console.log(this.gameObject.parent.width, this.gameObject.parent.height);
        // }
    }

    update(dt: number): void {
        if (!this._refresh) {
            return;
        }
        this._refresh = false;
        this.resize();
    }

    onDestroy(): void {
        this.gameObject.emitter.off(GameObject.Event.CHILD_ADDED, this._resize, this)
        this.gameObject.emitter.off(GameObject.Event.CHILD_REMOVED, this._resize, this)
    }
}