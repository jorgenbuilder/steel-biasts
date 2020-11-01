import Phaser from 'phaser';
import Game from './game';

declare global {
    interface Window {
        game: Game;
    }
};

const game = new Game();
window.game = game;

if (module.hot) {
    module.hot.accept('./game', () => {
        console.log('Accepting game.');
    });
}

export default game;