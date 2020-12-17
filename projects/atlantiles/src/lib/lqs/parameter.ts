import { IParameterValue } from './interfaces';

/**
 * Created by Fundemic and handed to Ganz 07.09.2015.
 */
export class Parameter {
    private name: string;
    private value: number;
    private minValue: number;
    private maxValue: number;

    constructor(v: number, n: string, min = 0, max = 1) {
        this.value = v;
        this.name = n;
        this.minValue = min;
        this.maxValue = max;
    }

    public get Name(): string { return this.name; }

    public set Value(v: number) { this.value = v; }
    public get Value(): number { return this.value; }

    public get Min(): number { return this.minValue; }
    public get Max(): number { return this.maxValue; }

    public set Data(v: IParameterValue){
        this.name = v.n;
        this.value = v.v;
        // minValue = v.mi;
        // maxValue = v.ma;
    }
    public get Data(): IParameterValue {
        return {n: this.Name, v: this.value, mi: this.Min, ma: this.Max};
    }
}
