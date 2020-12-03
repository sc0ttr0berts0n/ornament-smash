import * as PIXI from 'pixi.js-legacy';
import Game from './game';
import Victor = require('victor');

interface MousePos {
    x: number;
    y: number;
    clicked: boolean;
}

export default class Crosshair {
    private game: Game;
    private mousePos: MousePos;
    private el: PIXI.Sprite;
    private pos: Victor;
    constructor(game: Game) {
        this.game = game;
        this.el = new PIXI.Sprite(this.game.graphics.crosshair);
        this.mousePos = {
            x: this.game.app.screen.width / 2,
            y: this.game.app.screen.height / 2,
            clicked: false,
        };
        this.pos = new Victor(this.mousePos.x, this.mousePos.y);
        this.init();
    }
    init() {
        this.el.anchor.set(0.5, 0.5);
        this.el.scale.set(this.game.app.screen.width > 600 ? 1 : 0.66);
        this.game.graphics.crosshairLayer.addChild(this.el);
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mousedown', this.onClickStart.bind(this));
        document.addEventListener('mouseup', this.onClickEnd.bind(this));
        document.addEventListener('touchstart', this.onClickStart.bind(this));
        document.addEventListener('touchend', this.onClickEnd.bind(this));
    }
    update() {
        const lerpFactor = 0.3;
        const lerp = new Victor(this.mousePos.x, this.mousePos.y)
            .subtract(this.pos)
            .multiplyScalar(lerpFactor);
        this.pos.add(lerp);
        this.render();
    }
    render() {
        this.el.position.set(this.pos.x, this.pos.y);
        if (this.mousePos.clicked) {
            this.el.texture = this.game.graphics.crosshairPressed;
        } else {
            this.el.texture = this.game.graphics.crosshair;
        }
    }
    onMouseMove(e: MouseEvent) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    }
    onClickStart(e: MouseEvent | TouchEvent) {
        if (e instanceof TouchEvent) {
            this.mousePos.x = e.touches[0].clientX;
            this.mousePos.y = e.touches[0].clientY;
        }
        this.mousePos.clicked = true;
    }
    onClickEnd() {
        this.mousePos.clicked = false;
        document.body.classList.remove('isClicked');
    }
}
