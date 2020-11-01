import Phaser from 'phaser';

declare global {
    interface Window {
        game: Phaser.Game;
    }
};

const preload:Phaser.Types.Scenes.ScenePreloadCallback = () => {
    console.log(`Preloading...`);
};

const create:Phaser.Types.Scenes.SceneCreateCallback = () => {
    console.log(`Creating...`);
};

const gameConf:Phaser.Types.Core.GameConfig = {
    scale: {
        width: 2560,
        height: 1440,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: document.querySelector('body'),
    },
    scene: {
        preload: preload,
        create: create,
    },
};

const game = new Phaser.Game(gameConf);
window.game = game;

export default game;