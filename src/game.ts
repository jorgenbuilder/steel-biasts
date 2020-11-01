import Phaser from 'phaser';

class Game {
    game: Phaser.Game;
    preload: Phaser.Types.Scenes.ScenePreloadCallback;
    create: Phaser.Types.Scenes.SceneCreateCallback;
    conf: () => Phaser.Types.Core.GameConfig;

    constructor () {
        this.create = () => {
            console.log('Creating...');
        }
        this.preload = () => {
            console.log('Preloading...')
        }
        this.game = new Phaser.Game({
            scale: {
                width: 2560,
                height: 1440,
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: document.querySelector('body'),
            },
            scene: {
                preload: this.preload,
                create: this.create,
            },
        });
    }
}
export default Game;