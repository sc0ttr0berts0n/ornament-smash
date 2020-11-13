import { Howl } from 'howler';
import Game from './game';

export default class AudioAssets {
    public game: Game;
    public thump = new Howl({ src: ['assets/audio/wallbreak2.mp3'] });

    constructor(game: Game) {
        this.game = game;
    }
}
