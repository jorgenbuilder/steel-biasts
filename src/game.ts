import Phaser from 'phaser';
import TavernScene from 'scenes/chapter-1/Tavern';
import TavernWayScene from 'scenes/chapter-1/TavernWay';
import DevHUD from 'scenes/DevHUD';
import GameWorldScene from 'scenes/GameScene';

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
    scene: [
        GameWorldScene,
        TavernScene,
        TavernWayScene,
        DevHUD,
    ],
};

const game = new Phaser.Game(config);

export default game;