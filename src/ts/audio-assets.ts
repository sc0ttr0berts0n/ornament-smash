import { Howl } from 'howler';
import Game from './game';

export default class AudioAssets {
    public game: Game;

    constructor(game: Game) {
        this.game = game;
    }
}
