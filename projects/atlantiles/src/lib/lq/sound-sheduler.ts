// tslint:disable: indent
// tslint:disable: no-trailing-whitespace
// tslint:disable: max-line-length
// tslint:disable: variable-name

import { SoundController } from './sound-controller';

/**
 * Музыка и звуки
 * @author zu. It was given to Webkinz by Fundemic.
 */
export class SoundSheduler {
	
	private static isBackgroundMusicMuted: boolean;
	
	public static playSound(id: string, loop: boolean = false): void {
		SoundController.getInstance().playSound(id, loop);
	}
	
	public static playSoundWithCallback(id: string, loop: boolean = false, onComplete: () => void = null): void {
		SoundController.getInstance().playSound(id);
		// this._soundManager.playSoundWithCallback(id, endSoundCallback);
	}
	
	/*
	public static get musicEnable(): boolean { 
		// return !this._soundManager.isBackgroundMusicMuted;
		return !SoundSheduler.isBackgroundMusicMuted;
	}
	public static set musicEnable(value: boolean) {
		// this._soundManager.setMutedBackgroundMusic(!value);
	}*/

	public static playMusic(): void
	{
		SoundController.getInstance().playAudio();
	}

	public static stopMusic(): void
	{
		SoundController.getInstance().stopAudio();
	}

	public static pauseMusic(): void
	{
		SoundController.getInstance().pauseAudio();
	}

	public static resumeMusic(): void
	{
		SoundController.getInstance().resumeAudio();
	}

	public static enableAudio(arg: boolean): void
	{
		arg ? this.resumeMusic() : this.pauseMusic();
	}
	
	public static cleanup(): void {
	}	
}
