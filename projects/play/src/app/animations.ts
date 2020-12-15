import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';


/** Angular Animations Tutorial | Mosh, https://www.youtube.com/watch?v=ra5qNKNc95U */
export let fade = trigger('fade', [
    state('void', style({
        opacity: 0
    })),

    transition(':enter, :leave', [ //  transition('void <=> *', [
        animate(1000) // 1000 ms
    ]),
]);


/** https://angular.io/guide/animations */
// Trigger animation tiles array
export let openClose = trigger('openClose', [

    // Initially the all tiles are not visible
    state('closed', style({
        opacity: 0.0,
        transform: 'translateY(500%)'
    })),

    state('open', style({
        opacity: 1.0
    })),

    // Transition from any state to any state
    transition('closed <=> open', [
        animate('100ms ease-out') // or '0.5s' or 500
    ]),
]);


export let openCloseStagger = trigger('openCloseStagger', [

    // Transition from any state to any state
    transition('closed <=> open', [
        query('@*', [ // @openCloseStagger, https://angular.io/api/animations/query
            style({ opacity: 0, transform: 'translateY(300%)' }),
            stagger(1000, [animate('0.5s', style({ opacity: 1 }))])
        ], { optional: true }
        )
    ]),
]);


export let staggerEnter = trigger('staggerEnter', [

    // Transition from any state to any state
    transition('* => *', [
        query('@*', [
            style({ opacity: 0 }),
            stagger(1000, [animate('0.5s', style({ opacity: 1 }))])
        ], { optional: true }
        )
    ])
]);


/**
 * Collapse - expand Start button.
 * https://angular.io/guide/animations
 */
export let hideDown = trigger('hideDown', [

    state('closed', style({
        opacity: 0.0,
        transform: 'translateY(100%)'
    })),

    state('open', style({
        opacity: 1.0
    })),

    transition('closed <=> open', [
        animate('200ms ease-out') // or '0.5s' or 500
    ]),
]);

export let gridAnimation = trigger('gridAnimation', [
    transition('void <=> *', [
        query(':enter',
            [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
            { optional: true }
        ),
        query(':leave',
            animate('200ms', style({ opacity: 0 })),
            { optional: true }
        )
    ])
]);
