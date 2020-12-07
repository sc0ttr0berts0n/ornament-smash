declare global {
    interface Window {
        game: Game;
    }

    interface Vec2 {
        x: number;
        y: number;
    }
}

import Game from './game';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);
window.game = game;

document.body.classList.remove('no-js');
