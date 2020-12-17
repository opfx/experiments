export interface ILevels
{
    AtlantilesData: IAtlantilesData;
}

export interface IAtlantilesData
{
    converterURL: string;
    gamevalues: {
        panelFade: number,
        scoreDivisor1: number,
        scoreDivisor2: number,
        scoreMultiplier1: number,
        scoreMultiplier2: number,
        lineFadeTime: number,
        kinzCashDivisor: number,
        happiness: number,
    };

    AtlantilesAwards: {
        tagline: {name: string, earned: number},
        trophy: {name: string, earned: number}
    };

    AtlantilesLevels: {
        gameboard: ILevel[] // {id: string, columns: number[] }}
    };
}

export interface ILevel
{
    row: number[][];
    level: number;
    rows: number;
    columns: number;
    baseScore: number;
    timeBonusMin: number;
    timeBonusMax: number;
    timeBonusDecrement: number;
    hintTimeBonusDecrement: number;
    hintScoreMultiplier: number;
    showAllScoreMultiplier: number;
}

export class GameLevels {
    public data: ILevels =
    {
        AtlantilesData: {
            converterURL: 'https://codebeautify.org/xmltojson',
            gamevalues: {
                panelFade: 0.50,
                scoreDivisor1: 2.00,
                scoreDivisor2: 4.00,
                scoreMultiplier1: 25.00,
                scoreMultiplier2: 0.00,
                lineFadeTime: 1.00,
                kinzCashDivisor: 125.00,
                happiness: 525
            },
            AtlantilesAwards: {
                tagline: {
                    name: 'threeForThree',
                    earned: 0
                },
                trophy: {
                    name: 'AtlantilesTrophy',
                    earned: 0
                }
            },
            AtlantilesLevels: {
                gameboard: [
                    {
                        row: [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        ],
                        level: 1,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 100.00,
                        timeBonusMax: 200.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
                        ],
                        level: 2,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 130.00,
                        timeBonusMax: 350.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1]
                        ],
                        level: 3,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 220.00,
                        timeBonusMax: 575.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0]
                        ],
                        level: 4,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 190.00,
                        timeBonusMax: 550.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
                        ],
                        level: 5,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 275.00,
                        timeBonusMax: 880.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1],
                            [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                            [1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1]
                        ],
                        level: 6,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 260.00,
                        timeBonusMax: 980.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [0, 0, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1],
                            [0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1],
                            [1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0],
                            [1, 1, 1, 1, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 0, 0]
                        ],
                        level: 7,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 350.00,
                        timeBonusMax: 1450.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    },
                    {
                        row: [
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
                            [2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2],
                            [2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2],
                            [1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
                        ],
                        level: 8,
                        rows: 10,
                        columns: 20,
                        baseScore: 35.00,
                        timeBonusMin: 375.00,
                        timeBonusMax: 1800.00,
                        timeBonusDecrement: 1.00,
                        hintTimeBonusDecrement: 0.00,
                        hintScoreMultiplier: 0.40,
                        showAllScoreMultiplier: 0.20
                    }
                ]
            }
        }
    };
}
