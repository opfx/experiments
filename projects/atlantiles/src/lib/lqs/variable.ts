/** lqs implementation */
export class Variable {
    protected static readonly table: string[] = ['a', 'b', 'G', 'gT', 'sO', 'Dp', 'l>', 'c', 'fn', 'pK'];
    private valueString: string;

    constructor(v: number) {
        this.Value = v;
    }

    protected static decrypt(vs: string): number {
        let vvs: string = vs;
        let old: string;
        let i = 0;

        while (true) {
            old = vvs;
            vvs = vvs.replace('S', '.');
            if (vvs === old) { break; }
        }

        const arr: string[] = vvs.split('M');
        if (arr.length === 2) {

            let value: string = arr[0];
            for (i = 0; i < Variable.table.length; i++) {
                old = value;
                value = value.replace(Variable.table[i], i.toString());
                if (old !== value) { i--; }
            }

            let summ: string = arr[1];
            for (i = 0; i < Variable.table.length; i++) {
                old = summ;
                summ = summ.replace(Variable.table[i], i.toString());
                if (old !== summ) { i--; }

            }

            let summInt = 0;
            for (i = 0; i < value.length; i++) {
                if (value.charAt(i) === '.') {
                } else {
                    summInt += Number(value.charAt(i));
                }
            }

            if (summInt.toString() !== summ) {
                return null;
            } else {
                return Number(value);
            }
        } else {
            return null;
        }
    }

    public static  parse(vs: string): Variable {
        const variable: Variable = new Variable(Variable.decrypt(vs));
        return variable;
    }

    public encrypt(v: number): string {
        const vs: string = v.toString();
        let summ = 0;
        let s = '';
        let i: number;

        for (i = 0; i < vs.length; i++) {
            if (vs.charAt(i) === '.') {
                s += 'S';

            } else {
                summ += Number(vs.charAt(i));
                s += Variable.table[Number(vs.charAt(i))];
            }
        }
        s += 'M';

        const summS: string = summ.toString();
        for (i = 0; i < summS.length; i++) {
            if (summS.charAt(i) === '.') {
                s += 'S';
            } else {
                s += Variable.table[Number(summS.charAt(i))];
            }
        }
        return s;
    }

    public get Hash(): string {
        return this.valueString;
    }

    public get Value(): number {
        return Variable.decrypt(this.valueString);
    }

    public set Value(v: number) {
        this.valueString = this.encrypt(v);
    }

    public destroy(): void {
        this.valueString = null;
    }
}
