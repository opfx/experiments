/**
 * Created by Fundemic and handed to Ganz 17.08.2015.
 */
import { Container, Graphics, DisplayObject, Point } from 'pixi.js';
import { IContainer } from './icontainer';
import { Game } from './game';
import { LEvent } from './levent';

export class Memory {
    private gameData: object;
    private paramData: object;

    constructor(gd, pd = null) {
        if (gd) {
            this.gameData = Json.decode(gd);
        }
        if (pd) {
            this.paramData = Json.decode(pd);
        }
    }

    public getParamData(): object {
        return this.paramData;
    }
    public getGameData(): object {
        return this.gameData;
    }
    public load(slot: string): object {
        const shared: SharedObject = SharedObject.getLocal(slot);
        if (shared) {
            if (shared.data.SETTINGS) {
                return shared.data.SETTINGS;
            } else {
                return null;
            }
        }
        return null;
    }
    public save(slot: string, obj: object, h_complete: Function = null): void {
        const shared: SharedObject = SharedObject.getLocal(slot);
        if (!shared) {
            shared = new SharedObject();
        }
        shared.data.SETTINGS = obj;
        const flushStatus: string;
        try {
            flushStatus = shared.flush(10000);
        } catch (error: Error) {
            console.log('Error...Could not write SharedObject to disk\n');
        }

        if (flushStatus !== null || flushStatus !== undefined) {
            switch (flushStatus) {
                case SharedObjectFlushStatus.PENDING:
                    console.log('Requesting permission to save object...\n');
                    shared.addEventListener(NetStatusEvent.NET_STATUS, h_flush_status);
                    break;
                case SharedObjectFlushStatus.FLUSHED:
                    console.log('Value flushed to disk.\n');
                    if (h_complete) { h_complete(); }
                    break;
            }
        }
    }
    private  h_flush_status(e: NetStatusEvent): void {
        console.log('User closed permission dialog...\n');
        switch (e.info.code) {
            case 'SharedObject.Flush.Success':
                console.log('User granted permission -- value saved.\n');
                break;
            case 'SharedObject.Flush.Failed':
                console.log('User denied permission -- value not saved.\n');
                break;
        }
        console.log('\n');

        (e.target as SharedObject).removeEventListener(NetStatusEvent.NET_STATUS, h_flush_status);
    }
}
