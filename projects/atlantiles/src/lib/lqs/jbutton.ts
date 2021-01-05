/**
 * Created by Fundemic and handed to Ganz 31.10.2015.
 */
import { Button } from './button';
import { Game } from './game';

export class JButton extends Button {
    constructor(g: Game, tname: string, s: number, px = 0, py = 0, ds = 1.1, os = NaN, us = NaN) {
        super(g, tname, s, px, py, ds, os, us);
    }
}
