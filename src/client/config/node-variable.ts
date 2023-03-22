
export class NodeVariable {
    constructor(index: number, value: number) {
        this.index = index;
        this.value = value;
    }
    index: number;

    private _value:number = 0;

    get value(): number {
        return this._value;
    }
    set value(nv) {
        if (nv < 0) nv = 0;
        if (nv > 255) nv = 255;
        this._value = nv;
    }
};
