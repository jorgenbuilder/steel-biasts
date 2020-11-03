import Phaser from 'phaser';
import TavernScene from 'scenes/chapter-1/Tavern';
import DevHUD from 'scenes/DevHUD';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        width: 2560,
        height: 1440,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: document.querySelector('body'),
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500, },
            debug: true,
        },
    },
    scene: [TavernScene, DevHUD],
};

const game = new Phaser.Game(config);

export default game;