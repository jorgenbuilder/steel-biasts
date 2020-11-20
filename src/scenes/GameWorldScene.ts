import { DevData } from './DevHUD';
import GameScene from './GameLevelScene';
import TavernMusic from 'assets/music/tavern.ogg';
import BlipAudio from 'assets/sfx/dialogue-blip.ogg';

interface GameSettings {
    volume: number;
    music: boolean;
}

export default class GameWorldScene extends Phaser.Scene {

    private initialScene: string = 'TavernScene';
    private activeScene: string | undefined;

    public musicTrack: Phaser.Sound.BaseSound;

    public gameSettings: GameSettings = {
        volume: .5,
        music: false,
    };
    
    constructor () {
        super('GameWorldScene');
    }

    preload () {
        // Music
        this.load.audio('tavern-music', TavernMusic);

        // SFX
        this.load.audio('blip', BlipAudio);
    }

    create () {
        this.scene.launch('DevHUD');
        this.scene.get('GameWorldScene').events.on('teleport', (destination: string, origin: string) => {
            this.activateGameScene(destination, origin);
        });
        this.activateGameScene(this.initialScene);
        this.scene.launch('EscMenuScene');

        this.events.on('playSong', (song: string) => this.playSong(song));
        this.events.on('stopSong', () => this.stopSong());
        this.events.on('setMusicVolume', (volume: number) => this.setMusicVolume(volume));
        this.events.on('updateGameSettings', (settings: Partial<GameSettings>) => this.gameSettings = Object.assign({}, this.gameSettings, settings));
    }
    
    activateGameScene (sceneKey: string, previousSceneKey: string = undefined) {
        console.debug(`🎬 Changing scene: ${sceneKey}`);
        if (this.activeScene) {
            this.unsubscribeDevHUD(this.activeScene);
            this.scene.sleep(this.activeScene);
            this.scene.stop(this.activeScene);
        }
        if (previousSceneKey) {
            (this.scene.get(sceneKey) as GameScene).spawnAt = previousSceneKey;
        }
        this.scene.launch(sceneKey);
        this.activeScene = sceneKey;
        this.subscribeDevHUD(sceneKey);
        this.scene.get('GameWorldScene').events.emit('devData', {
            location: sceneKey
        });
    }

    subscribeDevHUD (scene: string) {
        this.scene.get(scene).events.on('devData', (data: DevData) => {
            this.scene.get('GameWorldScene').events.emit('devData', data);
        });
    }
    
    unsubscribeDevHUD (scene: string) {
        this.scene.get(scene).events.off('devData');
    }

    playSong (song?: string) {
        if (this.musicTrack) {
            if (this.musicTrack.key === song || (!song)) {
                this.musicTrack.play();
                return;
            }
            this.musicTrack.stop();
            this.musicTrack.destroy();
        }
        if (!song) return;
        this.musicTrack = this.sound.add(song, {
            loop: true,
            volume: this.gameSettings.volume,
        });
        if (this.gameSettings.music) this.musicTrack.play();
    }

    stopSong () {
        this.musicTrack.stop();
    }

    setMusicVolume (volume: number) {
        console.log(`Set volume: ${volume} (not yet implemented.)`)
    }

    update () {
        this.scene.get('GameWorldScene').events.emit('devData', {
            music: this.gameSettings.music,
            volume: this.gameSettings.volume,
        });
    }

}