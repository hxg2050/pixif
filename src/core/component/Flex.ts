import { Component } from "../pixifComponent";

export class Flex extends Component {
    private _grow = 1;
    get grow() {
        return this._grow;
    }
    set grow(val: number) {
        this._grow = val;
    }
}