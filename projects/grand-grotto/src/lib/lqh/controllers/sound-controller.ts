// import { Container, Point, AnimatedSprite, Sprite, Texture, Rectangle } from 'pixi.js';
import sound from 'pixi-sound';

// declare type Sound = sound.Sound;
export class SoundController {
    public static readonly AUDIO: string = 'backgroundMusic';
    private static instance: SoundController;

    private audioId: string;
    private audio: sound.Sound = null;
    
    public static getInstance(): SoundController {
        if (!SoundController.instance) {
            SoundController.instance = new SoundController();
        }
        return SoundController.instance;
    }

    /** The only audio difference - id is assigned here. */
    public addAudio(url: string): void {
        // sound is sound from 'pixi-sound'
        sound.add(SoundController.AUDIO, url);
    }

    /** Added to make SoundController not grand-grotto specific. */
    public add(id: string, url: string): void {
        // sound is sound from 'pixi-sound'
        sound.add(id, url);
    }

    /**
     * from: pixi-sound.d.ts:
     *     function play(alias: string,
     *   options?: PlayOptions | CompleteCallback | string): IMediaInstance | Promise<IMediaInstance>;
     */
    public playAudio(volume: number = 1): void 
    {
        this.audioId = SoundController.AUDIO;
        if (!this.audio) {
            if (sound.exists(this.audioId)) {
                    // this.audio: IMediaInstance | Promise<IMediaInstance>
                    // this.audio = sound.play(SoundController.AUDIO, {loop: true}); // returns Promise<IMediaInstance> and "{loop : true}" isn't working
                    sound.play(this.audioId);

                    this.audio = sound.find(SoundController.AUDIO);
                    if (this.audio) {
                        this.audio.loop = true;
                        this.audio.singleInstance = true;
                        this.audio.volume = volume;
                    }
            }

        } else {
            this.playAudioInstance();
        }

        return;

        if (!this.audio) {
            const classThis = this;

            // async loading:
            this.audio = sound.Sound.from({
                url: 'assets/sounds/grand_grotto_theme_one.mp3',
                preload: true,
                loop: true,
                loaded: function(err, sound1) {
                    sound1.play();
                }
            });

        } else {
            this.audio.stop();
            this.audio.play();
        }
    }

    private playAudioInstance(): void {
        this.audio = sound.find(SoundController.AUDIO);
        if (this.audio) { this.audio.stop();}
    }

    public stopAudio(): void {
        this.audio = sound.find(SoundController.AUDIO);
        if (this.audio) { this.audio.stop();}
    }

    public pauseAudio(): void {
        this.audio = sound.find(SoundController.AUDIO);
        if (this.audio) { this.audio.pause();}
    }

    public resumeAudio(): void {
        this.audio = sound.find(SoundController.AUDIO);
        if (this.audio) { this.audio.resume();}
    }

    /** Don't name variable so "sound"! It will override definition! 
     *      const sound1: sound.Sound = sound.Sound.from('gems_match', {});
     *      sound1.play();
     * 
     * still PROBLEM:
     *  Error: DOMException: Failed to set the 'buffer' property on 'AudioBufferSourceNode': Cannot set buffer to non-null after it has been already been set to a non-null buffer
     *      at set (c:\work\projects\grand-grotto-ts\webkinz\node_modules\pixi-sound\dist\pixi-sound.esm.js:9:8701)
     *      at (anonymous) (c:\work\projects\grand-grotto-ts\webkinz\node_modules\pixi-sound\dist\pixi-sound.esm.js:9:9338)
     *      at (anonymous) (c:\work\projects\grand-grotto-ts\webkinz\node_modules\pixi-sound\dist\pixi-sound.esm.js:9:12071)
     */
    public playSound(id: string): void {
        // console.log('[SoundController].playSound(), id: ' + id);
        if (sound.exists(id)) {
            const sound1: sound.Sound = sound.find(id);
            // console.log('   [..].playSound(), sound1: ' + sound1 + (sound1? (', isPlaying: ' + sound1.isPlaying) : ''));

            if (sound1 && sound1.isPlaying) {
                sound1.stop();
            }

            sound.play(id);
        }
    }

    public stopAll(): void {
        // sound is sound from 'pixi-sound'
        sound.stopAll();
    }

    public cleanup(): void {
        this.stopAll();
        this.audio = null;
        SoundController.instance = null;
    }
}