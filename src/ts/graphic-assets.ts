import * as PIXI from 'pixi.js';
import Game from './game';

export default class GraphicAssets {
    private game: Game;

    // layers
    public ornamentLayer = new PIXI.Container();
    public confettiLayer = new PIXI.Container();
    public crosshairLayer = new PIXI.Container();

    //icons
    public icon_bell = PIXI.Texture.from('assets/ic_bell.png');
    public icon_candle = PIXI.Texture.from('assets/ic_candle.png');
    public icon_candy = PIXI.Texture.from('assets/ic_candy.png');
    public icon_crest = PIXI.Texture.from('assets/ic_crest.png');
    public icon_deer = PIXI.Texture.from('assets/ic_deer.png');
    public icon_gift = PIXI.Texture.from('assets/ic_gift.png');
    public icon_mitten = PIXI.Texture.from('assets/ic_mitten.png');
    public icon_snowflake = PIXI.Texture.from('assets/ic_snowflake.png');
    public icon_snowman = PIXI.Texture.from('assets/ic_snowman.png');
    public icon_sock = PIXI.Texture.from('assets/ic_sock.png');
    public icon_toy = PIXI.Texture.from('assets/ic_toy.png');
    public icon_tree = PIXI.Texture.from('assets/ic_bell.png');
    public icons = [
        this.icon_bell,
        this.icon_candle,
        this.icon_candy,
        this.icon_crest,
        this.icon_deer,
        this.icon_gift,
        this.icon_mitten,
        this.icon_snowflake,
        this.icon_snowman,
        this.icon_sock,
        this.icon_sock,
        this.icon_toy,
        this.icon_tree,
    ];

    // confetti
    public confetti_a = PIXI.Texture.from('assets/confetti-a.png');
    public confetti_b = PIXI.Texture.from('assets/confetti-b.png');
    public confetti_c = PIXI.Texture.from('assets/confetti-c.png');
    public confetti_d = PIXI.Texture.from('assets/confetti-d.png');
    public confetti_e = PIXI.Texture.from('assets/confetti-e.png');
    public confetti_f = PIXI.Texture.from('assets/confetti-f.png');
    public confetti = [
        this.confetti_a,
        this.confetti_b,
        this.confetti_c,
        this.confetti_d,
        this.confetti_e,
        this.confetti_f,
    ];

    public crosshair = PIXI.Texture.from('assets/crosshair.png');
    public crosshairPressed = PIXI.Texture.from('assets/crosshair-pressed.png');

    constructor(game: Game) {
        this.game = game;
    }

    public placeAssets(): void {
        this.game.app.stage.addChild(this.confettiLayer);
        this.game.app.stage.addChild(this.ornamentLayer);
        this.game.app.stage.addChild(this.crosshairLayer);
    }
}
