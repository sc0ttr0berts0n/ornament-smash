import { Howl } from 'howler';
import Game from './game';

export default class AudioAssets {
    public game: Game;
    public BGM_MAX_VOLUME = 0.25;
    public ORNAMENT_LAUNCH_VOLUME = 0.5;
    public SMASH_ORNAMENT_VOLUME = 0.4;
    public bgm = new Howl({
        src: ['assets/audio/jingle-bells-bgm.mp3'],
    });
    public ornament_launch = new Howl({
        src: ['assets/audio/ornament-launch.mp3'],
    });
    private smash_ornament_a = new Howl({
        src: ['assets/audio/smash-ornament-a.mp3'],
    });
    private smash_ornament_b = new Howl({
        src: ['assets/audio/smash-ornament-b.mp3'],
    });
    private smash_ornament_c = new Howl({
        src: ['assets/audio/smash-ornament-c.mp3'],
    });
    private smash_ornament_d = new Howl({
        src: ['assets/audio/smash-ornament-d.mp3'],
    });
    private smash_ornament_e = new Howl({
        src: ['assets/audio/smash-ornament-e.mp3'],
    });
    public smash_ornaments = [
        this.smash_ornament_a,
        this.smash_ornament_b,
        this.smash_ornament_c,
        this.smash_ornament_d,
        this.smash_ornament_e,
    ];
    constructor(game: Game) {
        this.game = game;
        this.bgm.loop(true);
        this.ornament_launch.volume(this.ORNAMENT_LAUNCH_VOLUME);
        this.smash_ornaments.forEach((orn) => {
            orn.volume(this.SMASH_ORNAMENT_VOLUME);
        });
    }
    playRandomSoundFromArray(arr: Howl[]) {
        const index = Math.floor(Math.random() * arr.length);
        arr[index].play();
    }
}
