/**
 * Created by Fundemic and handed to Ganz 03.07.2015.
 */
export class LEvent extends Event {
    public static readonly GO_SCREEN = 'GO_SCREEN';
    //
    public static readonly DEV_BUTTON_CLICK = 'DEV_BUTTON_CLICK';
    public static readonly DEV_BUTTON_DOWN = 'DEV_BUTTON_DOWN';
    public static readonly DEV_BUTTON = 'DEV_BUTTON';
    public static readonly BUTTON_DOWN = 'BUTTON_DOWN';
    public static readonly BUTTON_UP = 'BUTTON_UP';
    public static readonly SLIDER_CHANGE = 'SLIDER_CHANGE';
    public static readonly CELL_UP = 'CELL_UP';
    public static readonly CELL_DOWN = 'CELL_DOWN';

    private transfer: object;

    constructor(type: string, data: object = null) {
        super(type);
        this.transfer = data;
    }

    public get Data(): object {
        return this.transfer;
    }

    public get data(): string {
        return String(this.transfer);
    }
}
