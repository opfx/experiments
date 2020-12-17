import { AssetData } from '../../lqs/interfaces';

export class AtlantilesGameAssets {

    public data: AssetData = {
        assetMap:
        {
            fonts:
            [
                { assetName: 'font1', source: 'assets/atlantiles/fonts/font1.fnt' },
                { assetName: 'font2', source: 'assets/atlantiles/fonts/font2.fnt' },
                { assetName: 'font3', source: 'assets/atlantiles/fonts/font3.fnt' }
            ],
            skin:
            [
                { assetName: 'background', source: 'assets/atlantiles/png/background.png' }
                , { assetName: 'end-game-background', source: 'assets/atlantiles/png/end_game.png' }
                , { assetName: 'instructions-1', source: 'assets/atlantiles/png/i1.png' }
                , { assetName: 'instructions-2', source: 'assets/atlantiles/png/i2.png' }
                , { assetName: 'loading', source: 'assets/atlantiles/png/loading.png' }
                , { assetName: 'game-logo', source: 'assets/atlantiles/png/logo.png' }
                , { assetName: 'menu_back', source: 'assets/atlantiles/png/menu_back.png' }
                , { assetName: 'webkinz-logo', source: 'assets/atlantiles/png/webkinz.png' }
            ],
            sound:
            [
                {
                    assetName: 'backgroundMusic', source: 'assets/atlantiles/mp3/theme.mp3'
                }
                , { assetName: 'atlantiles_music_a', source: 'assets/atlantiles/mp3/atlantiles_music_a.mp3'}
                , { assetName: 'atlantiles_music_b', source: 'assets/atlantiles/mp3/atlantiles_music_b.mp3'}
                , { assetName: 'atlantiles_music_c', source: 'assets/atlantiles/mp3/atlantiles_music_c.mp3'}
                , { assetName: 'atlantiles_softer_no_main', source: 'assets/atlantiles/mp3/atlantiles_softer_no_main.mp3'}
                , { assetName: 'button', source: 'assets/atlantiles/mp3/button.mp3'}
                , { assetName: 'deselect', source: 'assets/atlantiles/mp3/deselect.mp3'}
                , { assetName: 'error', source: 'assets/atlantiles/mp3/error.mp3'}
                , { assetName: 'Game_lost_break_crashing', source: 'assets/atlantiles/mp3/Game_lost_break_crashing.mp3'}
                , { assetName: 'green_line_bing_1', source: 'assets/atlantiles/mp3/green_line_bing_1.mp3'}
                , { assetName: 'green_line_bing_2', source: 'assets/atlantiles/mp3/green_line_bing_2.mp3'}
                , { assetName: 'green_line_bing_3', source: 'assets/atlantiles/mp3/green_line_bing_3.mp3'}
                , { assetName: 'green_line_bing_4', source: 'assets/atlantiles/mp3/green_line_bing_4.mp3'}
                , { assetName: 'hint', source: 'assets/atlantiles/mp3/hint.mp3'}
                , { assetName: 'select', source: 'assets/atlantiles/mp3/select.mp3'}
                , { assetName: 'triumphant', source: 'assets/atlantiles/mp3/triumphant.mp3'}
                , { assetName: 'underwater', source: 'assets/atlantiles/mp3/underwater.mp3'}
            ],
            spritesheet:
            [
                { assetName: 'tiles', source: 'assets/atlantiles/spritesheet/tiles.json' }
            ],
            text:
            [
                { assetName: 'levels-data', source: 'assets/atlantiles/json/levels.json' }
            ]
        }
    };
}
