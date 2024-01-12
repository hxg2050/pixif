import { Ticker } from "pixi.js";
import { Constructor, GameObject } from "./GameObject";
import { setProps } from "./utils/setProps";

const COMPONENT_CONTAINER_MAP = new WeakMap<GameObject, WeakMap<Constructor<Component>, Component[]>>();

let _ticker: Ticker;

export function registerComponent(ticker: Ticker) {
    _ticker = ticker;
}

export interface IComponent {
    onDestroy?: () => void
}

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
        removeComponent(this);
        this.update && _ticker.remove(this.update, this);
    }

    onDestroy?() {

    }
}

export function addComponent<T extends GameObject, U extends Component>(node: T, component: Constructor<U>, props?: Partial<U>): U {
    if (!COMPONENT_CONTAINER_MAP.has(node)) {
        COMPONENT_CONTAINER_MAP.set(node, new WeakMap());
    }

    const ALL = COMPONENT_CONTAINER_MAP.get(node)!;
    if (!ALL.has(component)) {
        ALL.set(component, []);
    }
    const list = ALL.get(component)!;
    const _component = new component(node);
    list.push(_component);
    _component.awake && _component.awake();
    _component.start && _ticker.addOnce(_component.start, _component);
    _component.update && _ticker.add(_component.update, _component);
    props && setProps(_component, props);
    return _component;
}

export function getComponent<T extends Component>(node: GameObject, component: Constructor<T>): T | undefined {
    const ALL = COMPONENT_CONTAINER_MAP.get(node);
    if (!ALL) {
        return;
    }

    const list = ALL.get(component);
    if (!list || list.length == 0) {
        return;
    }

    return list[0] as T;
}

export function getComponents<T extends Component>(node: GameObject, component: Constructor<T>): T[] | undefined {
    const ALL = COMPONENT_CONTAINER_MAP.get(node);
    if (!ALL) {
        return;
    }

    const list = ALL.get(component);
    if (!list || list.length == 0) {
        return;
    }

    return list as T[];
}

export function getComponentInChildren<T extends Component>(node: GameObject, component: Constructor<T>): T[] | undefined {
    const _component = getComponents(node, component);
    if (!!_component) {
        return _component;
    }

    const _node = node as GameObject;

    if (!_node.children || _node.children.length == 0) {
        return;
    }
    for (let i = 0; i < _node.children.length; i++) {
        const _component = getComponentInChildren(_node.getChildAt(i), component);
        if (_component) {
            return _component;
        }
    }
    return;
}

// export function getComponentsInChildren<T extends Component>(node: DisplayObject, component: Constructor<T>): T[] {
//     const _component = getComponents(node, component) || [];

//     const _node = node as Container;

//     if (!_node.children || _node.children.length == 0) {
//         return _component;
//     }
//     for (let i = 0; i < _node.children.length; i++) {
//         const __component = getComponentsInChildren(_node.getChildAt(i), component);
//         // console.log(_component);
//         _component.push(...__component)
//         // if (__component) {

//         //     return __component.concat(_component);
//         // }
//     }
//     return _component;
// }

function removeComponent(component: Component) {
    const ALL = COMPONENT_CONTAINER_MAP.get(component.gameObject);
    if (!ALL) {
        return;
    }
    const list = ALL.get(Object.getPrototypeOf(component).constructor);
    if (!list) {
        return;
    }
    const index = list.indexOf(component);
    if (index == -1) {
        return;
    }
    list.splice(index, 1);
    component.onDestroy && component.onDestroy();
}