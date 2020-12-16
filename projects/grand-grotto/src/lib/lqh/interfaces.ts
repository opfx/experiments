import { CellModel } from "./progress-model/cell-model";
import { CellObjectModel } from './progress-model/cell-object-model';
import { BaseModel } from './progress-model/base-model';

export interface CheatCalls {
    cheatClickAtIndex(index: number): void;
}

export interface IGame {
    quit(): void
}

export interface GamePlay {
    executeFieldAction(type: string, cell: CellModel, cellObject: CellObjectModel, pointNumber: number): void;
    collect(cell: CellModel, guest: CellObjectModel, byWater: boolean): void;
    hasCollectableMoving(): boolean;
}

export interface IMoveToTargetInitiator {
    onGuestReachedTargetPoint(guest: CellObjectModel): void;
}

export interface ICollectFalling {
    checkWhatIsFalling(fallingObject: CellObjectModel, cellToFallIn: CellModel): void;
}

export interface IButtonClickHandler {
    executeButtonClick(buttonId: string): void;
}

export interface IBaseAndScreenController {
    execute(callerId: string, type: string): void;
}

export interface Neighbor {
    getId(): number;
    getNeighbours(): Neighbor[];
    isLinkedTo(arg: Neighbor): boolean;
    getTraversed(): boolean;
    setTraversed(arg: boolean): void;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface ObjectFactory {
    createCellObjectModel(type: string): CellObjectModel;
}

export interface ICellModel {
    xi: number;
    yi: number;
    x: number;
    y: number;
    scale: number;
    color: number;
    tenantName: string
    cellW: number;
    cellH: number;
    hasPowerupOfType(type: string): boolean;
    removeGuestPlus(guest: BaseModel): void;
}

// --- ---
export enum Powerups {
    POWERUP_ALL_OF_COLOR = 'POWERUP_ALL_OF_COLOR',
    POWERUP_DIRECTED = 'POWERUP_DIRECTED',
    // POWERUP_AREA = 'POWERUP_AREA',
    POWERUP_LIFE = 'POWERUP_LIFE'
}

export enum Alias {
    ALIAS_BORDER = 'cell-borders',
    ALIAS_1_CELLS = 'cell-with-background-only',
    ALIAS_2_COLLECTABLES = 'COLLECTABLE-ALIAS',
    ALIAS_3_LIQUID_BASE = 'LIQUID-BASE-ALIAS', // LIQUID is penetrated if there is no base, but in view is belows all bases!
    ALIAS_3_BASE = 'BASE-ALIAS',
    ALIAS_4_MATCHING_COLORs = 'MATCHING_COLORs-ALIAS',
    ALIAS_5_MARKS = 'MARKS_ALIAS'
}

export enum LayerId {
    LAYER_FOR_FIELD_DECORATION = 'LAYER_FOR_FIELD_DECORATION',
    LAYER_FOR_FIELD_BORDERS = 'layer_for_field-borders',
    LAYER_FOR_CELL_BACKGROUNDS = 'layer_for_border-in-cells',
    LAYER_FOR_COLLECTABLES = 'LAYER_FOR_COLLECTABLES',
    LAYER_FOR_LIQUID_BASE = 'LAYER_FOR_LIQUID_BASE',
    LAYER_FOR_BASES = 'LAYER_FOR_BASES',
    LAYER_FOR_MATCHING_COLORs = 'LAYER_FOR_MATCHING_COLORs',
    LAYER_FOR_MARKS = 'LAYER_FOR_MARKS',
    LAYER_FOR_TEXT_COST = 'LAYER_FOR_TEXT_COST'
}

export enum FieldAction {
    CELL_UP = 'CELL_UP',
    CELL_DOWN = 'CELL_DOWN',
    UNLOCK_KEY = 'UNLOCK',
    RESCUE_PERS = 'COLLECTED',
    NEXT_ROOM_WAIT = 'NEXT_FIELD_WAIT',
    NEXT_ROOM = 'NEXT_FIELDS',
    ADD_POINTS = 'ADD_POINTS_BY_COLOR'
}

export enum ObjectState {
    COLLECTED = 'OBJECT-STATES.COLLECTED',
    OUT_CELL_ACTIVATED = 'OBJECT-STATES.OUT_CELL_ACTIVATED',
    GEM_HIGH_LIGHT2 = 'OBJECT-STATES.GEM_HIGH_LIGHT' // FOCUSING = 'OBJECT-STATES.FOCUSING'
}

// --- ---
export enum EventTarget {
    LEVEL_SELECT = 'LEVEL_SELECT',
    GAME_PLAY = 'GAME_PLAY',
    END_SCREEN = 'END_SCREEN', 
    DEV_EDITOR = 'DEV_EDITOR'
}

export enum LevelSelectEvent {
    LEVEL_SELECT = 'LEVEL_SELECT'
}

export enum GamePlayEvent {
    LEVEL_SELECT = 'LEVEL_SELECT_fromGamePlay',
    VICTORY = 'VICTORY',
    DEFEAT = 'DEFEAT',
    GAME_VICTORY = 'GAME_VICTORY'
}

export enum EndLevelScreenEvent {
    REPLAY_LEVEL = 'REPLAY_LEVEL',
    NEXT_LEVEL = 'NEXT_LEVEL'
}